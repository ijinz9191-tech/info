#!/usr/bin/env python3
"""Fetch pinned public upstream documentation; never execute downloaded code."""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import fnmatch
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import tempfile
import threading
import time
import urllib.error
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parent
CORPUS = ROOT / "corpus"
USER_AGENT = "public-offline-developer-corpus/1.0"
STOP = threading.Event()
DOC_EXT = {".md", ".mdx", ".markdown", ".rst", ".rest", ".adoc", ".asciidoc", ".txt", ".text", ".sgml", ".xml", ".scrbl", ".pod", ".tex", ".html", ".htm", ".dd", ".yo", ".yodl", ".src", ".man", ".1", ".3", ".7", ".8", ".9"}
CODE_EXT = {".py", ".java", ".c", ".h", ".cpp", ".hpp", ".cs", ".go", ".rs", ".js", ".ts", ".tsx", ".jsx", ".kt", ".swift", ".rb", ".php", ".lua", ".jl", ".zig", ".ex", ".exs", ".sh", ".sql", ".scala", ".fs", ".fsx", ".vb", ".pl", ".r", ".d", ".hs", ".f90", ".f95", ".f", ".for", ".elm", ".cr", ".v", ".gleam", ".ada", ".adb", ".ads", ".lisp", ".clj", ".scm", ".asm", ".nasm", ".cob", ".cbl"}
EXCLUDED = {"node_modules", "vendor", "third_party", "third-party", "external", ".git", ".github", "testdata", "fixtures", "translations", "locale", "locales", "dist", "_build", "generated"}
PRIORITY = {"python/cpython", "rust-lang/book", "reactjs/react.dev", "facebook/react", "spring-projects/spring-boot", "spring-projects/spring-framework", "kubernetes/website", "prometheus/docs", "open-telemetry/opentelemetry.io", "cp-algorithms/cp-algorithms"}


def sparse_archive(repo, commit, entry, destination, temporary, env):
    """Fetch only text-bearing roots when a website's media archive is too large."""
    checkout = Path(temporary) / "checkout"
    checkout.mkdir()
    def git(*args):
        subprocess.run(["git", "-c", "credential.helper=", *args], cwd=checkout,
                       env=env, capture_output=True, text=True, timeout=600, check=True)
    git("init")
    git("remote", "add", "origin", "https://github.com/" + repo + ".git")
    git("fetch", "--depth=1", "--filter=blob:none", "origin", commit)
    patterns = ["/*.md", "/*.rst", "/*.adoc", "/*LICENSE*", "/*LICENCE*", "/*COPYING*", "/*NOTICE*",
                "/doc/", "/docs/", "/Documentation/", "/manual/", "/guides/"]
    patterns.extend("/" + p.rstrip("/") + ("/" if not Path(p).suffix else "") for p in entry["docRoots"])
    patterns.extend("/" + p for p in entry["codePaths"])
    git("sparse-checkout", "set", "--no-cone", *patterns)
    git("checkout", "--detach", "FETCH_HEAD")
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
        for directory, folders, names in os.walk(checkout):
            folders[:] = [d for d in folders if d != ".git"]
            for name in names:
                file = Path(directory) / name
                if not file.is_symlink():
                    relative = file.relative_to(checkout).as_posix()
                    if classify(relative, entry):
                        bundle.write(file, "snapshot/" + relative)
    return {"archiveSha256": digest(destination.read_bytes()), "archiveBytes": destination.stat().st_size,
            "transport": "git-sparse-pinned-commit", "transportScope": patterns}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def write_json(file, data):
    file.parent.mkdir(parents=True, exist_ok=True)
    temp = file.with_suffix(file.suffix + ".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(file)


def registry():
    entries = {}
    extra = json.loads((CORPUS / "extra-sources.json").read_text(encoding="utf-8"))
    for row in extra["sources"]:
        repo, topic, roots = row[:3]
        entries[repo.lower()] = {"repo": repo, "topics": [topic], "docRoots": roots,
            "codePaths": row[3] if len(row) > 3 else [], "allCode": bool(row[4]) if len(row) > 4 else False,
            "embeddedLicensePaths": row[5] if len(row) > 5 else [],
            "discovery": "explicit-public-upstream-registry"}
    landscape = json.loads((ROOT / "public-data/cncf-landscape-index.json").read_text(encoding="utf-8"))
    unresolved = []
    for item in landscape["items"]:
        if not item.get("project"):
            continue
        match = re.fullmatch(r"https://github\.com/([^/]+/[^/#?]+?)(?:\.git)?/?", item.get("repo_url") or "")
        if not match:
            unresolved.append({"name": item["name"], "url": item.get("repo_url"), "reason": "no supported canonical GitHub repository"})
            continue
        repo = match[1]
        entry = entries.setdefault(repo.lower(), {"repo": repo, "topics": [], "docRoots": [], "codePaths": [], "allCode": False,
            "discovery": "pinned-cncf-landscape"})
        entry["topics"].append("cncf/" + item["category"] + "/" + item["subcategory"])
        entry.setdefault("cncfProjects", []).append({"name": item["name"], "maturity": item["project"]})
    result = {"schemaVersion": 1, "cncfSnapshotCommit": landscape["commit"], "cncfProjectEntries": sum(bool(i.get("project")) for i in landscape["items"]),
        "sources": sorted(entries.values(), key=lambda e: (e["repo"] not in PRIORITY, e["repo"].lower())), "unresolved": unresolved}
    write_json(CORPUS / "source-registry.json", result)
    return result


def classify(path, entry):
    p = PurePosixPath(path)
    parts = p.parts
    name = p.name.lower()
    if any(x.lower() in EXCLUDED for x in parts):
        return None
    if path in entry.get('embeddedLicensePaths', []):
        return 'license'
    if any(x.lower() == "licenses" for x in parts) or re.match(r"^(license|licence|copying|copyright|notice)([-._].*)?$", name):
        return "license"
    if path in entry["codePaths"]:
        return "representative-code"
    if p.suffix.lower() in CODE_EXT and (entry["allCode"] or any(x.lower() in {"examples", "example", "samples", "tutorials"} for x in parts)):
        return "upstream-example-code"
    if p.suffix.lower() not in DOC_EXT:
        return None
    roots = entry["docRoots"]
    under_root = any(r == "*" or path == r or path.startswith(r.rstrip("/") + "/") for r in roots)
    doc_path = any(x.lower() in {"docs", "doc", "documentation", "manual", "guides", "guide", "tutorials", "cheatsheets"} for x in parts)
    common = name.startswith(("readme", "changelog", "release", "faq", "migration", "architecture", "design", "troubleshoot"))
    if under_root or doc_path or common or (len(parts) == 1 and p.suffix.lower() in {".md", ".rst", ".adoc"}):
        return "official-document"
    return None


def fetch(entry, resume=False, max_archive=512 * 1024 * 1024, max_file=4 * 1024 * 1024):
    repo = entry["repo"]
    slug = repo.replace("/", "--").lower()
    index_path = CORPUS / "repositories" / (slug + ".json")
    prior = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else None
    policy_key = digest(json.dumps({"entry": entry, "docExtensions": sorted(DOC_EXT), "codeExtensions": sorted(CODE_EXT)}, sort_keys=True).encode())
    if STOP.is_set():
        return {"repo": repo, "status": "NOT_ATTEMPTED_RATE_LIMIT"}
    if resume and prior and prior.get("status") == "ACQUIRED":
        return {"repo": repo, "status": "REUSED_LOCAL", "documents": prior["counts"]["documents"], "code": prior["counts"]["code"], "bytes": prior["counts"]["bytes"]}
    try:
        env = dict(os.environ, GIT_TERMINAL_PROMPT="0")
        remote = subprocess.run(["git", "-c", "credential.helper=", "ls-remote", "https://github.com/" + repo + ".git", "HEAD"],
            capture_output=True, text=True, timeout=45, env=env, check=True)
        sha = re.match(r"([0-9a-f]{40})\s", remote.stdout).group(1)
        if prior and prior.get("commit") == sha and prior.get("status") == "ACQUIRED" and prior.get("selectionSha256") == policy_key:
            return {"repo": repo, "status": "UNCHANGED_PIN", "documents": prior["counts"]["documents"], "code": prior["counts"]["code"], "bytes": prior["counts"]["bytes"]}
        url = "https://codeload.github.com/" + repo + "/zip/" + sha
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with tempfile.TemporaryDirectory(prefix="public-corpus-") as temporary:
            archive = Path(temporary) / "source.zip"
            archive_hash = hashlib.sha256()
            total = 0
            started = time.monotonic()
            try:
                with urllib.request.urlopen(request, timeout=90) as response, archive.open("wb") as out:
                    if int(response.headers.get("Content-Length", "0")) > max_archive:
                        raise OverflowError("archive exceeds transport budget")
                    while block := response.read(1024 * 1024):
                        total += len(block)
                        if total > max_archive:
                            raise OverflowError("archive exceeds transport budget")
                        if time.monotonic() - started > 180:
                            raise OverflowError("media archive streaming deadline exceeded; use sparse text paths")
                        archive_hash.update(block)
                        out.write(block)
                transport = {"archiveSha256": archive_hash.hexdigest(), "archiveBytes": total, "transport": "codeload-zip"}
            except OverflowError:
                transport = sparse_archive(repo, sha, entry, archive, temporary, env)
            with zipfile.ZipFile(archive) as bundle:
                license_found = any(re.match(r"^(license|licence|copying|copyright)([-._].*)?$", PurePosixPath(m.filename).name.lower())
                                    for m in bundle.infolist() if not m.is_dir())
                if not license_found:
                    for m in bundle.infolist():
                        if '/'.join(PurePosixPath(m.filename).parts[1:]) in entry.get('embeddedLicensePaths', []) and m.file_size < max_file:
                            if b'Permission is hereby granted' in bundle.read(m):
                                license_found = True
                if not license_found:
                    raise RuntimeError("no upstream license found; source content not stored")
                files, omitted, recovered = [], [], []
                seen = set()
                for member in bundle.infolist():
                    if member.is_dir():
                        continue
                    parts = PurePosixPath(member.filename).parts[1:]
                    if not parts or any(x in {"", ".", ".."} for x in parts):
                        continue
                    path = "/".join(parts)
                    kind = classify(path, entry)
                    if not kind:
                        continue
                    if member.file_size > max_file or (member.file_size > 65536 and member.compress_size and member.file_size / member.compress_size > 300):
                        omitted.append({"path": path, "reason": "oversized or suspicious compression", "bytes": member.file_size})
                        continue
                    data = bundle.read(member)
                    try:
                        decoded = data.decode("utf-8-sig")
                    except UnicodeDecodeError:
                        omitted.append({"path": path, "reason": "non-UTF-8 source", "bytes": len(data)})
                        continue
                    if "\x00" in decoded:
                        omitted.append({"path": path, "reason": "binary data"})
                        continue
                    key = digest(path.encode("utf-8"))[:24]
                    if key in seen:
                        raise RuntimeError("source path hash collision")
                    seen.add(key)
                    suffix = PurePosixPath(path).suffix.lower() or ".txt"
                    local = Path("raw") / slug / sha[:12] / (key + suffix)
                    destination = CORPUS / local
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    if not destination.exists():
                        temp_source = destination.with_suffix(destination.suffix + '.tmp')
                        temp_source.write_bytes(data)
                        temp_source.replace(destination)
                    elif digest(destination.read_bytes()) != digest(data):
                        if prior:
                            raise RuntimeError("immutable indexed raw source conflict")
                        recovered.append({'path': path, 'previousSha256': digest(destination.read_bytes()), 'sourceSha256': digest(data),
                                          'reason': 'unindexed interrupted snapshot repaired from pinned upstream bytes'})
                        temp_source = destination.with_suffix(destination.suffix + '.tmp')
                        temp_source.write_bytes(data)
                        temp_source.replace(destination)
                    files.append({"path": path, "localPath": local.as_posix(), "kind": kind, "bytes": len(data), "sha256": digest(data),
                        "sourceUrl": "https://github.com/" + repo + "/blob/" + sha + "/" + path})
                licenses = [f for f in files if f["kind"] == "license"]
                if not licenses:
                    # Raw snapshot stays traceable, but it is excluded from training export.
                    license_state = "NO_LICENSE_CAPTURED_TRAINING_EXCLUDED"
                else:
                    license_state = "UPSTREAM_NOTICES_CAPTURED_PER_FILE_REVIEW_REQUIRED"
                counts = {"documents": sum(f["kind"] == "official-document" for f in files),
                    "code": sum(f["kind"] in {"representative-code", "upstream-example-code"} for f in files),
                    "licenses": len(licenses), "bytes": sum(f["bytes"] for f in files)}
                record = {"schemaVersion": 1, "repo": repo, "commit": sha, "retrievedAt": datetime.now(timezone.utc).isoformat(),
                    "status": "ACQUIRED", "topics": sorted(set(entry["topics"])), "archiveUrl": url,
                    "selectionSha256": policy_key, "selection": {"docRoots": entry["docRoots"], "codePaths": entry["codePaths"], "allCode": entry["allCode"]},
                    **transport, "licenseState": license_state,
                    "counts": counts, "files": files, "omitted": omitted, "recoveredInterruptedFiles": recovered,
                    "claimVerification": "source bytes acquired; technical claims and behavior not independently executed",
                    "trustedInstructions": False}
                write_json(index_path, record)
                return {"repo": repo, "status": "ACQUIRED", **counts, "omitted": len(omitted)}
    except urllib.error.HTTPError as exc:
        if exc.code in {403, 429}:
            STOP.set()
        return {"repo": repo, "status": "FAILED", "error": "HTTP " + str(exc.code), "priorSnapshotPreserved": bool(prior)}
    except Exception as exc:
        error = str(exc)
        if isinstance(exc, subprocess.CalledProcessError):
            error = (exc.stderr or "git ls-remote failed")[-600:]
        return {"repo": repo, "status": "FAILED", "error": error[:600], "priorSnapshotPreserved": bool(prior)}


def summary(reg, attempts):
    records = []
    for entry in reg["sources"]:
        file = CORPUS / "repositories" / (entry["repo"].replace("/", "--").lower() + ".json")
        if file.exists():
            records.append(json.loads(file.read_text(encoding="utf-8")))
    previous_report = CORPUS / 'acquisition-report.json'
    previous_attempts = json.loads(previous_report.read_text(encoding='utf-8')).get('attempts', []) if previous_report.exists() else []
    valid_repos = {e['repo'].lower() for e in reg['sources']}
    merged = {a['repo'].lower(): a for a in previous_attempts if a['repo'].lower() in valid_repos}
    merged.update({a['repo'].lower(): a for a in attempts})
    result = {"schemaVersion": 1, "generatedAt": datetime.now(timezone.utc).isoformat(), "registeredRepositories": len(reg["sources"]),
        "cncfProjectEntries": reg["cncfProjectEntries"], "unresolvedCncfEntries": reg["unresolved"], "acquiredRepositories": len(records),
        "documents": sum(r["counts"]["documents"] for r in records), "codeFiles": sum(r["counts"]["code"] for r in records),
        "licenseFiles": sum(r["counts"]["licenses"] for r in records), "sourceBytes": sum(r["counts"]["bytes"] for r in records),
        "attempts": sorted(merged.values(), key=lambda a: a["repo"].lower()), "trainingPerformed": False, "nativeOpenVikingImported": False}
    write_json(CORPUS / "acquisition-report.json", result)
    return result


def audit(reg):
    problems = []
    indexed = set()
    files = 0
    corpus_root = CORPUS.resolve()
    directories = {}
    def verify(item):
        relative = Path(item['localPath'])
        if relative.is_absolute() or '..' in relative.parts or len(relative.parts) != 4 or relative.parts[0] != 'raw' or not re.fullmatch(r'[0-9a-f]{24}\.[a-z0-9_.-]+', relative.name):
            return item['localPath']
        file = directories[relative.parent.as_posix()] / relative.name
        if file.is_symlink() or not file.is_file() or digest(file.read_bytes()) != item['sha256']:
            return item['localPath']
        return None
    for entry in reg["sources"]:
        index = CORPUS / "repositories" / (entry["repo"].replace("/", "--").lower() + ".json")
        if not index.exists():
            continue
        record = json.loads(index.read_text(encoding="utf-8"))
        for item in record['files']:
            parent = Path(item['localPath']).parent
            key = parent.as_posix()
            if key not in directories:
                directory = (CORPUS / parent).resolve()
                if not directory.is_relative_to(corpus_root):
                    raise RuntimeError('source directory escaped corpus')
                directories[key] = directory
        with ThreadPoolExecutor(max_workers=16) as pool:
            problems.extend(result for result in pool.map(verify, record['files']) if result)
        indexed.update(item['localPath'] for item in record['files'])
        files += len(record['files'])
        if files // 10000 != (files - len(record['files'])) // 10000:
            print(json.dumps({'auditProgressFiles': files, 'repo': entry['repo']}), flush=True)
    raw_files = {p.relative_to(CORPUS).as_posix() for p in (CORPUS / 'raw').rglob('*') if p.is_file()}
    report = {"status": "PASS" if not problems else "FAILED", "verifiedFiles": files, "problems": problems,
              "unindexedRawFiles": sorted(raw_files - indexed),
              "meaning": "Only indexed snapshot files are hash verified and used for dataset export; older/unindexed raw files are not exported"}
    write_json(CORPUS / 'audit-report.json', report)
    print(json.dumps({**report, 'unindexedRawFiles': len(report['unindexedRawFiles']), 'problems': problems[:30]}, ensure_ascii=False), flush=True)
    return bool(problems)


def main():
    parser = argparse.ArgumentParser()
    modes = parser.add_mutually_exclusive_group()
    for name in ("refresh", "resume", "audit", "registry"):
        modes.add_argument("--" + name, dest="mode", action="store_const", const="--" + name)
    parser.set_defaults(mode="--audit")
    parser.add_argument("--priority", action="store_true")
    parser.add_argument("--repo", action="append", help="Select a registered repository for a focused refresh; repeat for multiple repositories")
    parser.add_argument("--workers", type=int, default=4, choices=range(1, 9))
    args = parser.parse_args()
    mode = args.mode
    reg = registry()
    if mode == "--registry":
        print(json.dumps({"sources": len(reg["sources"]), "cncfProjectEntries": reg["cncfProjectEntries"], "unresolved": reg["unresolved"]}, ensure_ascii=False))
        return
    if mode == "--audit":
        raise SystemExit(audit(reg))
    if args.repo and not {r.lower() for r in args.repo}.issubset({e['repo'].lower() for e in reg['sources']}):
        parser.error('--repo must name a repository in the public registry')
    selected = [e for e in reg["sources"] if (not args.priority or e["repo"] in PRIORITY) and (not args.repo or e['repo'].lower() in {r.lower() for r in args.repo})]
    attempts = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        pending = {pool.submit(fetch, entry, mode == "--resume"): entry for entry in selected}
        for future in as_completed(pending):
            record = future.result()
            attempts.append(record)
            if len(attempts) % 25 == 0:
                summary(reg, attempts)
            print(json.dumps(record, ensure_ascii=False), flush=True)
    report = summary(reg, attempts)
    print(json.dumps({k: v for k, v in report.items() if k not in {"attempts", "unresolvedCncfEntries"}}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
