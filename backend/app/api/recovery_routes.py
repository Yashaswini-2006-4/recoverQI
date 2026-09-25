import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.core.scanner import scan_for_signatures
from app.core.carver import carve_files
from app.core.fragments import create_fragments
from app.core.reconstruction import reconstruct_by_file_type
from app.core.storage import (
    save_recovered_file,
    get_recovered_file,
)
from app.core.integrity import build_integrity_report


router = APIRouter(
    prefix="/api/recovery",
    tags=["Recovery"],
)


MAX_FILE_SIZE = 50 * 1024 * 1024


@router.post("/scan")
async def scan_file(
    file: UploadFile = File(...),
):
    """
    Scan an uploaded binary file for known file signatures.

    Returns frontend-friendly scan metadata including:
    - scan ID
    - detected files
    - recovered candidates
    - artifact metadata
    - SHA-256 hashes
    """

    start_time = time.perf_counter()

    data = await file.read(
        MAX_FILE_SIZE + 1
    )

    if not data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=(
                "File is too large. "
                "Maximum upload size is 50 MB."
            ),
        )

    filename = Path(
        file.filename or "uploaded_file.bin"
    ).name

    source_hash = hashlib.sha256(
        data
    ).hexdigest()

    try:
        signatures = scan_for_signatures(
            data
        )

        carved_files = carve_files(
            data
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                f"File analysis failed: {str(exc)}"
            ),
        )

    artifacts = []

    for index, item in enumerate(
        carved_files,
        start=1,
    ):
        recovered_data = item.get(
            "data",
            b"",
        )

        if not isinstance(
            recovered_data,
            bytes,
        ):
            recovered_data = bytes(
                recovered_data
            )

        sha256 = hashlib.sha256(
            recovered_data
        ).hexdigest()

        size = len(
            recovered_data
        )

        file_type = str(
            item.get(
                "file_type",
                "UNKNOWN",
            )
        ).upper()

        extension = {
            "JPEG": "jpg",
            "PNG": "png",
            "PDF": "pdf",
        }.get(
            file_type,
            file_type.lower(),
        )

        artifacts.append({
            "id": f"ART-{index:04d}",
            "fileName": (
                f"recovered_{index:03d}."
                f"{extension}"
            ),
            "name": (
                f"recovered_{index:03d}."
                f"{extension}"
            ),
            "type": file_type,
            "size": f"{size} B",
            "sizeBytes": size,
            "offset": item.get(
                "start_offset",
                0,
            ),
            "startOffset": item.get(
                "start_offset",
                0,
            ),
            "endOffset": item.get(
                "end_offset",
                0,
            ),
            "status": "RECOVERED",
            "integrity": sha256,
            "sha256": sha256,
            "priority": (
                "HIGH"
                if size > 0
                else "LOW"
            ),
        })

    elapsed = (
        time.perf_counter()
        - start_time
    )

    scan_id = (
        f"SCN-{int(time.time())}"
    )

    return {
        "scanId": scan_id,
        "targetDrive": (
            f"{filename} "
            f"({len(data) / (1024 * 1024):.2f} MB)"
        ),
        "timestamp": (
            datetime.now(
                timezone.utc
            ).isoformat()
        ),
        "summary": {
            "filesDetected": len(
                signatures
            ),
            "filesRecovered": len(
                carved_files
            ),
            "partialFiles": max(
                0,
                len(signatures)
                - len(carved_files),
            ),
            "failedFiles": 0,
            "scanDuration": (
                f"{elapsed:.2f}s"
            ),
        },
        "artifacts": artifacts,
        "source": {
            "filename": filename,
            "sizeBytes": len(data),
            "sha256": source_hash,
        },
        "integrity": {
            "sourceSha256": source_hash,
            "verified": True,
        },

        # Keep the original backend
        # scan response fields as well.
        "filename": filename,
        "size": len(data),
        "signatures_found": len(
            signatures
        ),
        "matches": signatures,
    }


@router.post("/recover")
async def recover_file(
    file: UploadFile = File(...),
):
    """
    Run the complete RecoverIQ recovery pipeline.

    Pipeline:

        Upload
        ↓
        Signature scanning
        ↓
        File carving
        ↓
        Fragment creation
        ↓
        Compatibility analysis
        ↓
        Reconstruction
        ↓
        Integrity validation
        ↓
        Storage
    """

    data = await file.read(
        MAX_FILE_SIZE + 1
    )

    if not data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=(
                "File is too large. "
                "Maximum upload size is 50 MB."
            ),
        )

    signatures = scan_for_signatures(
        data
    )

    carved_files = carve_files(
        data
    )

    fragments = create_fragments(
        carved_files
    )

    if not fragments:
        return {
            "filename": file.filename,
            "status": (
                "no_recoverable_files_found"
            ),
            "original_size": len(data),
            "signatures_found": len(
                signatures
            ),
            "fragments_found": 0,
            "recovered_files": 0,
            "reconstructions": {},
            "fragments": [],
        }

    reconstructions = (
        reconstruct_by_file_type(
            fragments
        )
    )

    recovered_files = {}

    for (
        file_type,
        result,
    ) in reconstructions.items():

        reconstruction_fragments = [
            fragment
            for fragment in fragments
            if fragment.fragment_id
            in result["fragment_ids"]
        ]

        is_complete = all(
            fragment.is_complete
            for fragment
            in reconstruction_fragments
        )

        recovery_status = (
            "complete"
            if is_complete
            else "partial"
        )

        integrity = (
            build_integrity_report(
                file_type,
                result["data"],
            )
        )

        saved = save_recovered_file(
            file_type=file_type,
            data=result["data"],
        )

        recovered_files[file_type] = {
            "filename": saved[
                "filename"
            ],
            "size": saved[
                "size"
            ],
            "recovery_status": (
                recovery_status
            ),
            "confidence_score": (
                result[
                    "confidence_score"
                ]
            ),
            "fragment_ids": (
                result[
                    "fragment_ids"
                ]
            ),
            "sha256": (
                integrity[
                    "sha256"
                ]
            ),
            "is_valid": (
                integrity[
                    "is_valid"
                ]
            ),
            "has_valid_header": (
                integrity[
                    "has_valid_header"
                ]
            ),
            "has_valid_footer": (
                integrity[
                    "has_valid_footer"
                ]
            ),
        }

    return {
        "filename": file.filename,
        "status": (
            "recovery_candidate_created"
        ),
        "original_size": len(data),
        "signatures_found": len(
            signatures
        ),
        "fragments_found": len(
            fragments
        ),
        "recovered_files": len(
            recovered_files
        ),
        "reconstructions": (
            recovered_files
        ),
        "fragments": [
            {
                "fragment_id": (
                    fragment.fragment_id
                ),
                "file_type": (
                    fragment.file_type
                ),
                "start_offset": (
                    fragment.start_offset
                ),
                "end_offset": (
                    fragment.end_offset
                ),
                "size": fragment.size,
                "is_complete": (
                    fragment.is_complete
                ),
            }
            for fragment in fragments
        ],
    }


@router.get(
    "/download/{filename}"
)
async def download_recovered_file(
    filename: str,
):
    """
    Download a recovered file safely.
    """

    file_path = get_recovered_file(
        filename
    )

    if file_path is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Recovered file not found."
            ),
        )

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type=(
            "application/octet-stream"
        ),
    )