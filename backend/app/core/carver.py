"""
Basic file carving engine for RecoverIQ.

The carver searches raw binary data for known file headers
and footers and extracts complete files when possible.
"""

from .signatures import FILE_SIGNATURES


def carve_files(data: bytes) -> list[dict]:
    """
    Search binary data for known file signatures and
    extract recoverable files.

    Returns:
        A list of recovered file candidates.
    """

    recovered_files = []

    for file_type, signature in FILE_SIGNATURES.items():

        header = signature["header"]
        footer = signature["footer"]

        search_position = 0

        while True:

            start = data.find(header, search_position)

            if start == -1:
                break

            end_position = data.find(
                footer,
                start + len(header)
            )

            if end_position == -1:
                # Header found but no footer.
                # Keep searching for another candidate.
                search_position = start + 1
                continue

            end = end_position + len(footer)

            file_data = data[start:end]

            recovered_files.append({
                "file_type": file_type,
                "start_offset": start,
                "end_offset": end,
                "size": len(file_data),
                "data": file_data,
            })

            search_position = end

    recovered_files.sort(
        key=lambda item: item["start_offset"]
    )

    return recovered_files