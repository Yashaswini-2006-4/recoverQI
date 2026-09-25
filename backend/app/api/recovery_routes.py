from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse

from app.core.scanner import scan_for_signatures
from app.core.carver import carve_files
from app.core.fragments import create_fragments
from app.core.reconstruction import reconstruct_by_file_type
from app.core.storage import save_recovered_file, get_recovered_file


router = APIRouter(
    prefix="/api/recovery",
    tags=["Recovery"],
)


@router.post("/scan")
async def scan_file(file: UploadFile = File(...)):
    """
    Scan an uploaded binary file for known file signatures.
    """

    data = await file.read()

    if not data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    matches = scan_for_signatures(data)

    return {
        "filename": file.filename,
        "size": len(data),
        "signatures_found": len(matches),
        "matches": matches,
    }


@router.post("/recover")
async def recover_file(file: UploadFile = File(...)):
    """
    Run the complete RecoverIQ recovery pipeline.

    Pipeline:
        Upload
        → Signature scanning
        → File carving
        → Fragment creation
        → File-type grouping
        → Reconstruction
        → Storage
    """

    data = await file.read()

    if not data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    # Step 1: Scan the binary data.
    signatures = scan_for_signatures(data)

    # Step 2: Carve recoverable files.
    carved_files = carve_files(data)

    # Step 3: Convert carved files into fragments.
    fragments = create_fragments(carved_files)

    # No recoverable fragments found.
    if not fragments:
        return {
            "filename": file.filename,
            "status": "no_recoverable_files_found",
            "original_size": len(data),
            "signatures_found": len(signatures),
            "fragments_found": 0,
            "reconstructions": {},
            "fragments": [],
        }

    # Step 4: Reconstruct each file type independently.
    reconstructions = reconstruct_by_file_type(
        fragments
    )

    # Step 5: Save each reconstructed file.
    saved_files = {}

    for file_type, result in reconstructions.items():

        saved = save_recovered_file(
            file_type=file_type,
            data=result["data"],
        )

        saved_files[file_type] = {
            "filename": saved["filename"],
            "size": saved["size"],
        }

    return {
        "filename": file.filename,
        "status": "recovery_candidate_created",
        "original_size": len(data),
        "signatures_found": len(signatures),
        "fragments_found": len(fragments),

        "reconstructions": {
            file_type: {
                "size": result["size"],
                "confidence_score": result[
                    "confidence_score"
                ],
                "fragment_ids": result[
                    "fragment_ids"
                ],
                "saved_filename": saved_files[
                    file_type
                ]["filename"],
            }
            for file_type, result in reconstructions.items()
        },

        "fragments": [
            {
                "fragment_id": fragment.fragment_id,
                "file_type": fragment.file_type,
                "start_offset": fragment.start_offset,
                "end_offset": fragment.end_offset,
                "size": fragment.size,
            }
            for fragment in fragments
        ],
    }


@router.get("/download/{filename}")
async def download_recovered_file(
    filename: str,
):
    """
    Download a recovered file.
    """

    file_path = get_recovered_file(filename)

    if file_path is None:
        raise HTTPException(
            status_code=404,
            detail="Recovered file not found.",
        )

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="application/octet-stream",
    )