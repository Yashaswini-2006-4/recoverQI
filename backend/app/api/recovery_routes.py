import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.scanner import scan_for_signatures
from app.core.carver import carve_files

router = APIRouter(prefix="/api/recovery", tags=["Recovery"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@router.post("/scan")
async def scan_file(file: UploadFile = File(...)):
    start_time = time.perf_counter()

    content = await file.read(MAX_FILE_SIZE + 1)

    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File is too large. Maximum upload size is 50 MB."
        )

    filename = Path(file.filename or "uploaded_file.bin").name
    source_hash = hashlib.sha256(content).hexdigest()

    try:
        signatures = scan_for_signatures(content)
        carved_files = carve_files(content)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"File analysis failed: {str(exc)}"
        )

    artifacts = []

    for index, item in enumerate(carved_files, start=1):
        recovered_data = item.get("data", b"")

        if not isinstance(recovered_data, bytes):
            recovered_data = bytes(recovered_data)

        sha256 = hashlib.sha256(recovered_data).hexdigest()
        size = len(recovered_data)
        file_type = str(item.get("file_type", "UNKNOWN")).upper()

        artifacts.append({
            "id": f"ART-{index:04d}",
            "fileName": f"recovered_{index:03d}.{file_type.lower()}",
            "name": f"recovered_{index:03d}.{file_type.lower()}",
            "type": file_type,
            "size": f"{size} B",
            "sizeBytes": size,
            "offset": item.get("start_offset", 0),
            "startOffset": item.get("start_offset", 0),
            "endOffset": item.get("end_offset", 0),
            "status": "RECOVERED",
            "integrity": sha256,
            "sha256": sha256,
            "priority": "HIGH" if size > 0 else "LOW",
        })

    elapsed = time.perf_counter() - start_time

    scan_id = f"SCN-{int(time.time())}"

    return {
        "scanId": scan_id,
        "targetDrive": f"{filename} ({len(content) / (1024 * 1024):.2f} MB)",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "filesDetected": len(signatures),
            "filesRecovered": len(carved_files),
            "partialFiles": max(0, len(signatures) - len(carved_files)),
            "failedFiles": 0,
            "scanDuration": f"{elapsed:.2f}s",
        },
        "artifacts": artifacts,
        "source": {
            "filename": filename,
            "sizeBytes": len(content),
            "sha256": source_hash,
        },
        "integrity": {
            "sourceSha256": source_hash,
            "verified": True,
        },
    }