#!/usr/bin/env python3
"""Build model-neutral text datasets and an OpenViking import source, offline."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
from concurrent.futures import ThreadPoolExecutor
from collections import deque

ROOT = Path(__file__).resolve().parent
CORPUS = ROOT / "corpus"
TRAINING = ROOT / "training"
VIKING = ROOT / "openviking" / "resources" / "official-corpus"
MAX_CHARS = 12000
SHARD_BYTES = 8 * 1024 * 1024
ERROR_PATTERN = re.compile(r"troubleshoot|debugg|known.?issues|bug.?fix|breaking.?change|migration|\berrors?\b|\bfail(?:ure|ed|ures)?\b|deadlock|panic|timeout|out.of.memory|race.condition|故障|错误|장애|오류", re.I)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def dump(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def line(obj):
    return (json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")


class Shards:
    def __init__(self, prefix):
        self.prefix, self.file, self.size, self.number = prefix, None, 0, 0
        self.files, self.count = [], 0

    def add(self, obj):
        data = line(obj)
        if self.file is None or self.size + len(data) > SHARD_BYTES:
            if self.file:
                self.file.close()
            path = TRAINING / f"{self.prefix}-{self.number:05d}.jsonl"
            self.number += 1
            self.file = path.open("wb")
            self.files.append(path)
            self.size = 0
        self.file.write(data)
        self.size += len(data)
        self.count += 1

    def close(self):
        if self.file:
            self.file.close()


def chunks(text):
    start = 0
    while start < len(text):
        end = min(start + MAX_CHARS, len(text))
        if end < len(text):
            boundary = text.rfind("\n\n", start + MAX_CHARS // 2, end)
            if boundary >= 0:
                end = boundary + 2
        yield start, end, text[start:end]
        start = end


def sections(text, path):
    # Source sections are evidence pointers, never invented resolved incidents.
    headings = list(re.finditer(r"(?m)^(?:#{1,6}\s+|={1,6}\s+|=head[1-6]\s+)([^\n]+)$", text))
    headings += list(re.finditer(r"(?m)^([^\n]+)\n[=~^+*-]{3,}\s*$", text))
    headings.sort(key=lambda m: m.start())
    for i, match in enumerate(headings):
        if ERROR_PATTERN.search(match[1]):
            end = headings[i + 1].start() if i + 1 < len(headings) else len(text)
            yield match[1].strip(), match.start(), end
    if not headings and ERROR_PATTERN.search(path):
        yield Path(path).name, 0, len(text)


def records():
    registry = json.loads((CORPUS / "source-registry.json").read_text(encoding="utf-8"))
    for entry in sorted(registry["sources"], key=lambda e: e["repo"].lower()):
        index = CORPUS / "repositories" / (entry["repo"].replace("/", "--").lower() + ".json")
        if index.exists():
            yield json.loads(index.read_text(encoding="utf-8"))


def source_bytes(items):
    """Bounded parallel local reads; ordered export keeps dataset deterministic."""
    corpus_root = CORPUS.resolve()
    directories = {}
    locations = {}
    for item in items:
        relative = Path(item['localPath'])
        if relative.is_absolute() or '..' in relative.parts or len(relative.parts) != 4 or relative.parts[0] != 'raw' or not re.fullmatch(r'[0-9a-f]{24}\.[a-z0-9_.-]+', relative.name):
            raise RuntimeError('invalid immutable source layout')
        parent = relative.parent.as_posix()
        if parent not in directories:
            directory = (CORPUS / relative.parent).resolve()
            if not directory.is_relative_to(corpus_root):
                raise RuntimeError('source directory escaped corpus')
            directories[parent] = directory
        locations[item['localPath']] = directories[parent] / relative.name
    def read(item):
        path = locations[item['localPath']]
        if path.is_symlink():
            raise RuntimeError('source file cannot be a symlink')
        return path.read_bytes()
    iterator = iter(items)
    with ThreadPoolExecutor(max_workers=16) as pool:
        pending = deque()
        for _ in range(16):
            item = next(iterator, None)
            if item is not None:
                pending.append((item, pool.submit(read, item)))
        while pending:
            item, future = pending.popleft()
            raw = future.result()
            successor = next(iterator, None)
            if successor is not None:
                pending.append((successor, pool.submit(read, successor)))
            yield item, raw


def build():
    TRAINING.mkdir(parents=True, exist_ok=True)
    VIKING.mkdir(parents=True, exist_ok=True)
    # Remove only this builder's old shard outputs within its own directory.
    for old in TRAINING.glob("*.jsonl"):
        if re.fullmatch(r"(?:train|eval|provenance|documents|incident-sections)-\d{5}\.jsonl", old.name):
            old.unlink()
    writers = {key: Shards(key) for key in ("train", "eval", "provenance", "documents", "incident-sections")}
    documents_seen, chunks_seen = set(), set()
    resources, repos = [], []
    stats = {"sourceDocuments": 0, "sourceCodeFiles": 0, "duplicateDocuments": 0, "duplicateChunks": 0,
             "licenseExcludedDocuments": 0, "whitespaceExcludedChunks": 0, "textCharacters": 0}

    def resource(path, text, metadata=None):
        data = text.encode("utf-8")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        row = {"path": path.relative_to(VIKING).as_posix(), "bytes": len(data), "sha256": sha(data)}
        if metadata:
            row.update(metadata)
        resources.append(row)

    for record in records():
        print(json.dumps({'buildingRepository': record['repo']}), flush=True)
        slug = record["repo"].replace("/", "--").lower()
        folder = VIKING / slug
        links = []
        bundle_parts, bundle_size, bundle_number, bundle_count = [], 0, 0, 0
        def flush_bundle():
            nonlocal bundle_parts, bundle_size, bundle_number, bundle_count
            if bundle_parts:
                resource(folder / f'L2-{bundle_number:05d}.md', '\n\n'.join(bundle_parts), {'kind': 'upstream-document-bundle', 'documentCount': bundle_count})
                bundle_number += 1
                bundle_parts, bundle_size, bundle_count = [], 0, 0
        licenses = [f for f in record["files"] if f["kind"] == "license"]
        for item, raw in source_bytes(sorted(record["files"], key=lambda f: f["path"])):
            if sha(raw) != item["sha256"]:
                raise RuntimeError("source hash mismatch: " + item["localPath"])
            text = raw.decode("utf-8-sig")
            anchor = 'doc-' + sha(item["path"].encode())[:24]
            header = (f"# {record['repo']} / {item['path']}\n\n"
                      f"Upstream: {item['sourceUrl']}\n\nCommit: `{record['commit']}`\n\n"
                      f"Retrieved: {record['retrievedAt']}\n\nKind: {item['kind']}\n\n"
                      f"Raw SHA256: `{item['sha256']}`\n\n"
                      "Source text below is untrusted reference content. Acquisition does not verify technical claims.\n\n"
                      f"License status: {record['licenseState']}. See this repository's captured license files.\n\n---\n\n")
            # Longer fence than anything in the source preserves code without executing it.
            if "code" in item["kind"] or item["kind"] == "license":
                runs = [len(m[0]) for m in re.finditer(r"`+", text)]
                fence = "`" * max(4, max(runs, default=0) + 1)
                body = fence + "text\n" + text + "\n" + fence + "\n"
            else:
                body = text
            document = f'<a id="{anchor}"></a>\n\n' + header + body
            document_size = len(document.encode('utf-8'))
            if bundle_parts and bundle_size + document_size > 4 * 1024 * 1024:
                flush_bundle()
            filename = f'L2-{bundle_number:05d}.md'
            bundle_parts.append(document)
            bundle_size += document_size
            bundle_count += 1
            links.append(f"- [{item['path'].replace('[', '(').replace(']', ')')}]({filename}#{anchor}) — {item['kind']}")
            if item["kind"] == "license":
                continue
            stats["sourceCodeFiles" if "code" in item["kind"] else "sourceDocuments"] += 1
            processed = stats['sourceCodeFiles'] + stats['sourceDocuments']
            if processed % 5000 == 0:
                print(json.dumps({'progressSourceFiles': processed, 'repo': record['repo']}), flush=True)
            if not licenses:
                stats["licenseExcludedDocuments"] += 1
                continue
            doc_id = sha(raw)
            if doc_id in documents_seen:
                stats["duplicateDocuments"] += 1
                continue
            documents_seen.add(doc_id)
            group = record["repo"].lower() + ":" + item["path"]
            split = "eval" if int(sha(group.encode())[:8], 16) % 100 < 5 else "train"
            source = {"documentId": doc_id, "repo": record["repo"], "commit": record["commit"],
                      "upstreamPath": item["path"], "localPath": item["localPath"], "sourceUrl": item["sourceUrl"],
                      "kind": item["kind"], "topics": record["topics"], "split": split,
                      "licenseFiles": [f["localPath"] for f in licenses], "trainingRights": "PER_FILE_REVIEW_REQUIRED",
                      "trustedInstructions": False, "technicalClaimsVerified": False}
            writers['documents'].add(source)
            for start, end, content in chunks(text):
                if not content.strip():
                    stats["whitespaceExcludedChunks"] += 1
                    continue
                chunk_id = sha(content.encode("utf-8"))
                if chunk_id in chunks_seen:
                    stats["duplicateChunks"] += 1
                    continue
                chunks_seen.add(chunk_id)
                writers[split].add({"id": chunk_id, "text": content})
                writers["provenance"].add({**source, "chunkId": chunk_id, "startCharacter": start, "endCharacter": end})
                stats["textCharacters"] += len(content)
            if item["kind"] == "official-document":
                for title, start, end in sections(text, item["path"]):
                    writers["incident-sections"].add({**source, "title": title, "startCharacter": start, "endCharacter": end,
                         "preview": text[start:min(end, start + 600)], "recordType": "UPSTREAM_SECTION_POINTER",
                         "actualResolvedIncident": None, "reviewState": "UNCLASSIFIED_SOURCE_SECTION", "resolutionIndependentlyVerified": False})
        flush_bundle()
        abstract = (f"# {record['repo']}\n\nOfficial upstream snapshot `{record['commit']}`. "
                    f"{record['counts']['documents']} documents; {record['counts']['code']} code files.\n\n"
                    f"Topics: {', '.join(record['topics'])}.\n")
        overview = (abstract + "\n## Provenance and limits\n\n"
                    f"Retrieved: {record['retrievedAt']}\n\nLicense: {record['licenseState']}\n\n"
                    "This overview is a deterministic index, not an LLM-generated technical summary. "
                    "Raw upstream content is preserved; version applicability and solutions require review.\n\n"
                    "## Files\n\n" + "\n".join(links) + "\n")
        for name, body in ((".abstract.md", abstract), ("L0-index.md", abstract), (".overview.md", overview), ("L1-index.md", overview)):
            resource(folder / name, body)
        repos.append({"repo": record["repo"], "commit": record["commit"], "counts": record["counts"], "topics": record["topics"], "folder": slug})
    for writer in writers.values():
        writer.close()
    # Old imported resources are retained by the server until explicitly reconciled.
    expected = {r["path"] for r in resources}
    stale = [p.relative_to(VIKING).as_posix() for p in VIKING.rglob("*") if p.is_file() and p.relative_to(VIKING).as_posix() not in expected and p.name != "README.md"]
    for relative in stale:
        target = (VIKING / relative).resolve()
        if not target.is_relative_to(VIKING.resolve()):
            raise RuntimeError("stale resource escaped output directory")
        target.unlink()
    table = "\n".join(f"| [{r['repo']}]({r['folder']}/L1-index.md) | {r['counts']['documents']} | {r['counts']['code']} | `{r['commit'][:12]}` |" for r in repos)
    resource(VIKING / "README.md", "# Official public developer corpus\n\n"
             "Import target: `viking://resources/official-corpus/`. Native import is not completed by this build.\n\n"
             "L2 files bundle full documents up to approximately 4 MiB; each document has a stable anchor and complete provenance. Original individual files are preserved in corpus/raw.\n\n"
             "Dot sidecars may be skipped by OpenViking's parser; visible L0/L1 indexes retain navigation.\n\n"
             "| Repository | Documents | Code | Commit |\n|---|---:|---:|---|\n" + table + "\n")
    artifact_files = []
    for path in sorted(TRAINING.glob("*.jsonl")):
        data = path.read_bytes()
        artifact_files.append({"path": path.name, "bytes": len(data), "sha256": sha(data)})
    report = {"schemaVersion": 1, "createdAt": datetime.now(timezone.utc).isoformat(), "model": None,
              "trainingPerformed": False, "nativeOpenVikingImported": False, "format": "model-neutral continued-pretraining text",
              "maxCharactersPerChunk": MAX_CHARS, "maxShardBytes": SHARD_BYTES, "repositories": len(repos),
              "uniqueDocuments": len(documents_seen), **stats,
              "trainChunks": writers['train'].count, "evalChunks": writers['eval'].count,
              "incidentSectionPointers": writers['incident-sections'].count,
              "splitPolicy": "stable upstream repo/path group hash, 5% eval; exact duplicate documents/chunks exported once globally",
              "limitations": ["per-file license review before training", "near duplicates not eliminated; eval is not an independent capability benchmark",
                              "API and version applicability not independently verified", "not an SFT instruction/answer dataset", "no model weights trained"],
              "files": artifact_files}
    dump(TRAINING / "manifest.json", report)
    manifest_folder = ROOT / 'openviking' / 'official-corpus-manifests'
    manifest_parts = []
    expected_parts = set()
    for offset in range(0, len(resources), 5000):
        part = manifest_folder / f"files-{offset // 5000:05d}.json"
        dump(part, {"files": resources[offset:offset + 5000]})
        expected_parts.add(part.name)
        data = part.read_bytes()
        manifest_parts.append({"path": part.relative_to(ROOT / 'openviking').as_posix(), "bytes": len(data), "sha256": sha(data)})
    for old in manifest_folder.glob('files-*.json'):
        if old.name not in expected_parts:
            old.unlink()
    dump(ROOT / "openviking" / "official-corpus-manifest.json", {"schemaVersion": 1, "createdAt": report["createdAt"],
         "virtualRoot": "viking://resources/official-corpus/", "source": "resources/official-corpus",
         "state": "IMPORT_SOURCE_PREPARED_NOT_IMPORTED", "nativeOpenVikingImported": False,
         "fileCount": len(resources), "fileManifests": manifest_parts})
    dump(CORPUS / "catalog.json", {"repositories": repos})
    acquisition = json.loads((CORPUS / 'acquisition-report.json').read_text(encoding='utf-8'))
    registry = json.loads((CORPUS / 'source-registry.json').read_text(encoding='utf-8'))
    acquired_names = {r['repo'].lower() for r in repos}
    failures = [e for e in registry['sources'] if e['repo'].lower() not in acquired_names]
    languages = sorted({t.split('/')[1] for r in repos for t in r['topics'] if t.startswith('languages/')})
    cncf_covered = sum(len(e.get('cncfProjects', [])) for e in registry['sources'] if e['repo'].lower() in acquired_names)
    domain_lines = []
    for domain in ['languages', 'frameworks', 'cncf', 'data', 'algorithms', 'systems', 'security', 'ml', 'tooling', 'observability']:
        entries = [r for r in repos if any(t == domain or t.startswith(domain + '/') for t in r['topics'])]
        domain_lines.append(f"| {domain} | {len(entries)} | {sum(r['counts']['documents'] for r in entries):,} | {sum(r['counts']['code'] for r in entries):,} |")
    gap_lines = '\n'.join(f"- `{e['repo']}`: 원문 미확보; 수집 보고서의 실패 사유 확인." for e in failures)
    gap_lines += '\n' + '\n'.join(f"- CNCF `{e['name']}`: {e['reason']}" for e in registry['unresolved'])
    (ROOT / 'corpus-overview.md').write_text(
        '# 공개 원문과 학습 데이터 범위\n\n'
        f"생성 시각: {report['createdAt']}. 기술 주장 검증일이 아니라 실제 파일을 수집·변환한 시각이다.\n\n"
        f"현재 {len(repos):,}/{len(registry['sources']):,}개 공개 저장소의 문서 {stats['sourceDocuments']:,}개, 코드 {stats['sourceCodeFiles']:,}개와 라이선스 파일을 확보했다. "
        f"원문은 {acquisition['sourceBytes']:,}바이트이며, 중복 제거 후 문서 {len(documents_seen):,}개를 학습용 {writers['train'].count:,}청크·평가용 {writers['eval'].count:,}청크로 변환했다. "
        f"오류·디버깅·버그 수정·마이그레이션 관련 공식 절 위치는 {writers['incident-sections'].count:,}개다. **절 위치는 추가로 검증된 실제 VOC 해결 건수가 아니다.**\n\n"
        f"고정 CNCF Landscape의 프로젝트 항목 {registry['cncfProjectEntries']}개 중 {cncf_covered}개는 저장소 원문을 확보했다. "
        "원문 몇 개를 가져온 상태와 제품 전체 문서·모든 버전의 완전한 복제는 다르다. 현재 건수를 상한으로 삼지 않는다.\n\n"
        '## 분야별 원문\n\n| 분야 | 저장소 | 문서 | 코드 |\n|---|---:|---:|---:|\n' + '\n'.join(domain_lines) + '\n\n'
        '분야가 겹치는 저장소가 있어 행의 숫자를 더하면 전체와 다를 수 있다.\n\n'
        '## 언어 계열\n\n' + ', '.join(languages) + '. 표에 없는 언어는 향후 공식 원천을 추가한다.\n\n'
        '## 탐색\n\n'
        '- [OpenViking 원문 탐색](openviking/resources/official-corpus/README.md): 저장소별 L0/L1 색인과 전체 수집 파일.\n'
        '- [학습 데이터 설명](training/README.md): 원문 추적, 중복 제거, 평가 분리, 수동 갱신.\n'
        '- [학습 manifest](training/manifest.json), [수집 결과](corpus/acquisition-report.json), [원천 목록](corpus/source-registry.json).\n\n'
        '## 미확보 원천\n\n' + (gap_lines.strip() or '없음. 선택한 경로 밖 내용과 바이너리 자료는 수집하지 않는다.') + '\n\n'
        '## 판독과 재검증\n\n'
        '원문 URL과 커밋 SHA, 파일별 SHA-256을 보관하며 UTF-8 텍스트만 저장한다. 그림·영상·바이너리, 일부 대형 파일, 제외 경로는 보관하지 않는다. '
        '원문 내부의 상대 링크와 생성기 지시문은 그대로 남아 있으므로 공식 사이트 전체를 실행 가능한 형태로 복제한 것은 아니다. '
        '개별 솔루션의 운영 재현·버전 적용성·모든 기술 주장은 별도로 검증해야 한다. '
        '이 데이터셋으로 모델의 가중치를 학습하지 않았고 새 원문을 네이티브 OpenViking 서버에 가져오지도 않았다.\n', encoding='utf-8')
    print(json.dumps({k: v for k, v in report.items() if k != "files"}, ensure_ascii=False))


def check():
    manifest = json.loads((TRAINING / "manifest.json").read_text(encoding="utf-8"))
    issues = []
    for item in manifest["files"]:
        file = (TRAINING / item["path"]).resolve()
        if not file.is_relative_to(TRAINING.resolve()) or not file.is_file() or sha(file.read_bytes()) != item["sha256"]:
            issues.append("dataset artifact hash: " + item["path"])
    docs = {}
    for file in sorted(TRAINING.glob('documents-*.jsonl')):
        for row in file.open(encoding='utf-8'):
            d = json.loads(row)
            docs[d['documentId']] = {'documentId': d['documentId'], 'localPath': d['localPath'], 'split': d['split'], 'metadataSha256': sha(line(d))}
    chunks_index, counts = {}, {"train": 0, "eval": 0}
    for split in ("train", "eval"):
        for file in sorted(TRAINING.glob(split + "-*.jsonl")):
            for row in file.open(encoding="utf-8"):
                obj = json.loads(row)
                if obj["id"] != sha(obj["text"].encode()) or obj["id"] in chunks_index:
                    issues.append("invalid/duplicate chunk " + obj["id"])
                chunks_index[obj["id"]] = split
                counts[split] += 1
    readback = set()
    cached_doc, cached_text = None, None
    documents_read = 0
    upstream_reader = iter(source_bytes(list(docs.values())))
    def read_next_document():
        nonlocal documents_read
        document, raw = next(upstream_reader)
        if sha(raw) != document['documentId']:
            issues.append('document hash mismatch: ' + document['localPath'])
        documents_read += 1
        return document, raw
    for file in sorted(TRAINING.glob("provenance-*.jsonl")):
        for row in file.open(encoding="utf-8"):
            item = json.loads(row)
            doc = docs[item["documentId"]]
            binding = {key: value for key, value in item.items() if key not in {'chunkId', 'startCharacter', 'endCharacter'}}
            if sha(line(binding)) != doc['metadataSha256']:
                issues.append('document/provenance metadata mismatch')
            if cached_doc != item["documentId"]:
                document, raw = read_next_document()
                while document['documentId'] != item['documentId']:
                    document, raw = read_next_document()
                cached_text, cached_doc = raw.decode("utf-8-sig"), item["documentId"]
            text = cached_text[item["startCharacter"]:item["endCharacter"]]
            if sha(text.encode()) != item["chunkId"] or chunks_index.get(item["chunkId"]) != item["split"] or item["chunkId"] in readback or doc["split"] != item["split"]:
                issues.append("provenance/split mismatch")
            readback.add(item["chunkId"])
    for document, raw in upstream_reader:
        if sha(raw) != document['documentId']:
            issues.append('document hash mismatch: ' + document['localPath'])
        documents_read += 1
    if readback != set(chunks_index):
        issues.append("provenance coverage mismatch")
    if counts != {"train": manifest["trainChunks"], "eval": manifest["evalChunks"]}:
        issues.append("chunk count mismatch")
    viking = json.loads((ROOT / "openviking" / "official-corpus-manifest.json").read_text(encoding="utf-8"))
    expected = set()
    for part in viking['fileManifests']:
        part_path = (ROOT / 'openviking' / part['path']).resolve()
        if not part_path.is_relative_to((ROOT / 'openviking').resolve()):
            raise RuntimeError('manifest path escaped OpenViking directory')
        if sha(part_path.read_bytes()) != part['sha256']:
            issues.append('OpenViking file manifest hash mismatch')
        for item in json.loads(part_path.read_text(encoding='utf-8'))['files']:
            file = (VIKING / item["path"]).resolve()
            if not file.is_relative_to(VIKING.resolve()) or not file.is_file() or sha(file.read_bytes()) != item["sha256"]:
                issues.append("OpenViking source hash mismatch: " + item["path"])
            expected.add(item["path"])
    actual = {p.relative_to(VIKING).as_posix() for p in VIKING.rglob("*") if p.is_file()}
    if actual != expected:
        issues.append("OpenViking source missing/extra files")
    if len(expected) != viking['fileCount']:
        issues.append('OpenViking file count mismatch')
    print(json.dumps({"status": "PASS" if not issues else "FAILED", "datasetChunks": counts,
                      "provenanceReadbacks": len(readback), "documentReadbacks": documents_read, "openvikingFiles": len(expected), "issues": issues[:20]}))
    raise SystemExit(bool(issues))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--build", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    build() if args.build else check()
