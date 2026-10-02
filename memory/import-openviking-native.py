#!/usr/bin/env python3
"""Import the public developer knowledge snapshot into a configured OpenViking server."""

import hashlib
import argparse
import json
import os
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
MANIFEST_FILE = ROOT / "openviking" / "manifest.json"
SOURCE = ROOT / "openviking" / "resources" / "developer-knowledge"
REPORT = ROOT / "openviking" / "native-import-report.json"


def verify_source(manifest):
    for item in manifest["files"]:
        file_path = (SOURCE / item["path"]).resolve()
        if not file_path.is_relative_to(SOURCE.resolve()):
            raise RuntimeError("Resource path escaped source directory")
        if not file_path.is_file():
            raise RuntimeError(f"Missing resource: {item['path']}")
        digest = hashlib.sha256(file_path.read_bytes()).hexdigest()
        if digest != item["sha256"]:
            raise RuntimeError(f"Changed resource: {item['path']}")


def main():
    global MANIFEST_FILE, SOURCE, REPORT
    parser = argparse.ArgumentParser()
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument('--official', action='store_true', help='Import the separately prepared public upstream corpus')
    selection.add_argument('--verified-synthesis', action='store_true', help='Import the separately reviewed LLM-wiki resources')
    parser.add_argument('--verify-source-only', action='store_true', help='Check local resource hashes without connecting to a server')
    args = parser.parse_args()
    if args.official:
        MANIFEST_FILE = ROOT / 'openviking' / 'official-corpus-manifest.json'
        SOURCE = ROOT / 'openviking' / 'resources' / 'official-corpus'
        REPORT = ROOT / 'openviking' / 'official-native-import-report.json'
    elif args.verified_synthesis:
        MANIFEST_FILE = ROOT / 'openviking' / 'verified-synthesis' / 'manifest.json'
        SOURCE = ROOT / 'openviking' / 'verified-synthesis' / 'resources' / 'verified-synthesis'
        REPORT = ROOT / 'openviking' / 'verified-synthesis-native-import-report.json'
    manifest_bytes = MANIFEST_FILE.read_bytes()
    manifest = json.loads(manifest_bytes)
    if args.official:
        files = []
        for part in manifest['fileManifests']:
            part_path = (ROOT / 'openviking' / part['path']).resolve()
            if not part_path.is_relative_to((ROOT / 'openviking').resolve()):
                raise RuntimeError('Manifest path escaped OpenViking directory')
            if hashlib.sha256(part_path.read_bytes()).hexdigest() != part['sha256']:
                raise RuntimeError('Changed file manifest: ' + part['path'])
            files.extend(json.loads(part_path.read_text(encoding='utf-8'))['files'])
        if len(files) != manifest['fileCount']:
            raise RuntimeError('Official corpus file count mismatch')
        manifest['files'] = files
    verify_source(manifest)
    if args.verify_source_only:
        print(json.dumps({'status': 'PASS', 'files': len(manifest['files']), 'nativeImportPerformed': False}))
        return
    endpoint = os.environ.get("OPENVIKING_URL", "http://127.0.0.1:1933")
    try:
        from openviking_sdk import SyncHTTPClient
    except ImportError as exc:
        raise SystemExit("Install the official openviking-sdk in the execution environment first") from exc

    client = SyncHTTPClient(url=endpoint, api_key=os.environ.get("OPENVIKING_API_KEY"))
    client.initialize()
    mode = os.environ.get("OPENVIKING_PROCESSING_MODE", "semantic_and_vectors")
    if mode not in {"semantic_and_vectors", "vectors_only"}:
        raise SystemExit(f"Unsupported processing mode: {mode}")
    wait = os.environ.get("OPENVIKING_WAIT", "1") != "0"
    result = client.add_resource(
        path=str(SOURCE),
        to=manifest["virtualRoot"],
        wait=wait,
        timeout=3600 if wait else None,
        options={
            "strict": True,
            "preserve_structure": True,
            "processing_mode": mode,
            "args": {} if args.official else {"parse_mode": "no_split"},
        },
    )
    failed_files = result.get("meta", {}).get("failed_files", [])
    skipped_files = result.get("meta", {}).get("skipped_files", [])
    queue_status = result.get("queue_status", {})
    queue_errors = sum(
        value.get("error_count", 0)
        for value in queue_status.values()
        if isinstance(value, dict)
    )
    if (result.get("status") not in ({"success"} if wait else {"accepted", "success"}) or
            result.get("root_uri", "").rstrip("/") != manifest["virtualRoot"].rstrip("/") or
            failed_files or queue_errors or
            (not wait and not result.get("task_id"))):
        raise RuntimeError(
            f"Import incomplete: status={result.get('status')}, "
            f"root_uri={result.get('root_uri')}, "
            f"failed_files={len(failed_files)}, queue_errors={queue_errors}"
        )
    report = {
        "checkedAt": datetime.now(timezone.utc).isoformat(),
        "state": "IMPORT_COMPLETED_AWAITING_READBACK" if wait else "IMPORT_QUEUED",
        "submissionStatus": result.get("status"),
        "manifestSha256": hashlib.sha256(manifest_bytes).hexdigest(),
        "virtualRoot": manifest["virtualRoot"],
        "resourceFiles": len(manifest["files"]),
        "processingMode": mode,
        "skippedFiles": len(skipped_files) if wait else None,
        "taskId": result.get("task_id"),
        "queueStatus": queue_status,
        "failedFiles": [] if wait else None,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
