"""
RecoverIQ Candidate Evaluation Engine.

Evaluates carved file candidates, checks file signatures,
calculates SHA-256 hashes, assigns recovery priorities,
evaluates reconstruction candidates, and generates reports.

This module uses standard Python libraries only.
"""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Any


FILE_SIGNATURES = {
    "jpeg": {
        "header": b"\xFF\xD8\xFF",
        "footer": b"\xFF\xD9",
    },
    "png": {
        "header": b"\x89PNG\r\n\x1a\n",
        "footer": b"IEND",
    },
    "pdf": {
        "header": b"%PDF-",
        "footer": b"%%EOF",
    },
}


def calculate_sha256(data: bytes) -> str:
    """Calculate the SHA-256 hash of binary file content."""

    if not isinstance(data, bytes):
        raise TypeError("File content must be bytes")

    return hashlib.sha256(data).hexdigest()


def verify_sha256(data: bytes, expected_sha256: str) -> bool:
    """Compare file content against an expected SHA-256 hash."""

    if not isinstance(expected_sha256, str):
        raise TypeError("Expected SHA-256 must be a string")

    expected = expected_sha256.strip().lower()

    if len(expected) != 64:
        return False

    try:
        int(expected, 16)
    except ValueError:
        return False

    return calculate_sha256(data) == expected


def normalize_format(file_type: Any) -> str:
    """Normalize a candidate's declared file format."""

    if not isinstance(file_type, str):
        return "UNKNOWN"

    normalized = file_type.strip().lower()

    aliases = {
        "jpg": "jpeg",
        "jpe": "jpeg",
        "png": "png",
        "pdf": "pdf",
        "jpeg": "jpeg",
    }

    return aliases.get(normalized, "UNKNOWN")


def detect_file_format(data: bytes) -> str:
    """Detect a supported format from its leading signature."""

    if not isinstance(data, bytes):
        raise TypeError("File content must be bytes")

    for file_type, signature in FILE_SIGNATURES.items():
        if data.startswith(signature["header"]):
            return file_type.upper()

    return "UNKNOWN"


def _valid_offset(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value >= 0


def evaluate_candidate(
    candidate: dict[str, Any],
    expected_sha256: str | None = None,
) -> dict[str, Any]:
    """
    Evaluate one candidate returned by the file-carving engine.

    Expected candidate fields:
        file_type, start_offset, end_offset, size, data

    A valid signature and footer do not guarantee that a file
    is structurally valid or can be opened by its intended application.
    """

    if not isinstance(candidate, dict):
        raise TypeError("Candidate must be a dictionary")

    data = candidate.get("data")

    if not isinstance(data, bytes):
        raise TypeError("Candidate data must be bytes")

    declared_format = normalize_format(candidate.get("file_type"))
    detected_format = detect_file_format(data)

    size = len(data)
    start_offset = candidate.get("start_offset")
    end_offset = candidate.get("end_offset")

    warnings: list[str] = []

    if size == 0:
        warnings.append("Candidate is empty")

    if declared_format == "UNKNOWN":
        warnings.append("Declared file format is unsupported")

    if detected_format == "UNKNOWN":
        warnings.append("File signature is not recognized")

    format_matches = (
    declared_format.upper() == detected_format
    and declared_format != "UNKNOWN"
)
    if declared_format != "UNKNOWN" and detected_format != "UNKNOWN":
        if not format_matches:
            warnings.append("Declared format does not match file signature")

    signature = FILE_SIGNATURES.get(declared_format)

    header_valid = bool(
        signature
        and data.startswith(signature["header"])
    )

    footer_valid = bool(
        signature
        and signature["footer"] in data
    )

    if signature and not header_valid:
        warnings.append("Expected file header is missing")

    if signature and not footer_valid:
        warnings.append("Expected file footer is missing")

    offsets_valid = (
        _valid_offset(start_offset)
        and _valid_offset(end_offset)
        and end_offset > start_offset
        and end_offset - start_offset == size
    )

    if not offsets_valid:
        warnings.append("Candidate offsets are missing or inconsistent")

    supplied_size = candidate.get("size")
    size_matches = (
        isinstance(supplied_size, int)
        and not isinstance(supplied_size, bool)
        and supplied_size == size
    )

    if not size_matches:
        warnings.append("Candidate size metadata is inconsistent")

    sha256 = calculate_sha256(data)

    hash_verified = None

    if expected_sha256 is not None:
        hash_verified = verify_sha256(data, expected_sha256)

        if not hash_verified:
            warnings.append("SHA-256 does not match the expected hash")

    is_complete_by_signatures = (
        size > 0
        and header_valid
        and footer_valid
        and format_matches
        and offsets_valid
        and size_matches
    )

    if size == 0:
        integrity_status = "EMPTY"
    elif detected_format == "UNKNOWN":
        integrity_status = "UNKNOWN_FORMAT"
    elif not format_matches:
        integrity_status = "FORMAT_MISMATCH"
    elif not header_valid or not footer_valid:
        integrity_status = "INCOMPLETE_SIGNATURES"
    elif not offsets_valid or not size_matches:
        integrity_status = "METADATA_INCONSISTENT"
    elif hash_verified is False:
        integrity_status = "HASH_MISMATCH"
    else:
        integrity_status = "SIGNATURES_AND_METADATA_VALID"

    # This is a heuristic priority, not a prediction of recovery success.
    if is_complete_by_signatures and hash_verified is not False:
        recovery_priority = "HIGH"
    elif detected_format != "UNKNOWN" and size > 0:
        recovery_priority = "MEDIUM"
    else:
        recovery_priority = "LOW"

    return {
        "file_type": declared_format,
        "detected_format": detected_format,
        "start_offset": start_offset,
        "end_offset": end_offset,
        "size": size,
        "sha256": sha256,
        "header_valid": header_valid,
        "footer_valid": footer_valid,
        "format_matches": format_matches,
        "offsets_valid": offsets_valid,
        "size_matches": size_matches,
        "is_complete_by_signatures": is_complete_by_signatures,
        "hash_verified": hash_verified,
        "integrity_status": integrity_status,
        "recovery_priority": recovery_priority,
        "warnings": warnings,
    }


def evaluate_reconstruction_candidates(
    candidates: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Evaluate and rank candidates using transparent heuristic rules.

    The original candidate is not modified. The returned records
    contain evaluation metadata, not the binary file contents.
    """

    if not isinstance(candidates, list):
        raise TypeError("Candidates must be a list")

    evaluated = []

    priority_order = {
        "HIGH": 0,
        "MEDIUM": 1,
        "LOW": 2,
    }

    for index, candidate in enumerate(candidates):
        result = evaluate_candidate(candidate)
        result["candidate_index"] = index
        evaluated.append(result)

    evaluated.sort(
        key=lambda result: (
            priority_order[result["recovery_priority"]],
            -result["size"],
            result["candidate_index"],
        )
    )

    return evaluated


def generate_recovery_report(
    candidates: list[dict[str, Any]],
) -> dict[str, Any]:
    """Generate a structured report for evaluated candidates."""

    results = evaluate_reconstruction_candidates(candidates)

    high = sum(
        result["recovery_priority"] == "HIGH"
        for result in results
    )
    medium = sum(
        result["recovery_priority"] == "MEDIUM"
        for result in results
    )
    low = sum(
        result["recovery_priority"] == "LOW"
        for result in results
    )

    return {
        "project": "RecoverIQ",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_candidates": len(results),
        "priority_summary": {
            "high": high,
            "medium": medium,
            "low": low,
        },
        "candidates": results,
        "limitations": [
            "Signature and footer checks do not prove structural validity.",
            "A matching SHA-256 requires a trusted expected hash.",
            "Recovery priority is a heuristic, not a recovery guarantee.",
            "No trained AI model is used by this evaluator.",
        ],
    }