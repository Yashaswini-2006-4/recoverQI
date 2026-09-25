"""
Binary scanner for RecoverIQ.

Scans raw binary data and identifies known file signatures.
"""

from .signatures import FILE_SIGNATURES


def scan_for_signatures(data: bytes) -> list[dict]:
    """
    Scan binary data for known file signatures.

    Returns a list containing the file type and
    byte offset where each signature was found.
    """

    matches = []

    for file_type, signature in FILE_SIGNATURES.items():
        header = signature["header"]

        start = 0

        while True:
            position = data.find(header, start)

            if position == -1:
                break

            matches.append({
                "file_type": file_type,
                "offset": position,
                "signature": header.hex(),
            })

            start = position + 1

    matches.sort(key=lambda item: item["offset"])

    return matches