#!/usr/bin/env python3
"""Import the public developer knowledge snapshot into a configured OpenViking server."""

import hashlib
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
        file_path = SOURCE / item["path"]
        if not file_path.is_file():
            raise RuntimeError(f"Missing resource: {item['path']}")
        digest = hashlib.sha256(file_path.read_bytes()).hexdigest()
        if digest != item["sha256"]:
            raise RuntimeError(f"Changed resource: {item['path']}")


def main():
    manifest_bytes = MANIFEST_FILE.read_bytes()
    manifest = json.loads(manifest_bytes)
    verify_source(manifest)
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
            "args": {"parse_mode": "no_split"},
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
        "skippedFiles": len(skipped_files),
        "taskId": result.get("task_id"),
        "queueStatus": queue_status,
        "failedFiles": [],
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
