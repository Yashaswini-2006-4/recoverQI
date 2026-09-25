"""
File signature definitions for RecoverIQ.

These signatures are used to identify known file formats
inside raw or corrupted binary data.
"""

FILE_SIGNATURES = {
    "jpeg": {
        "header": b"\xFF\xD8\xFF",
        "footer": b"\xFF\xD9",
        "extension": ".jpg",
        "mime_type": "image/jpeg",
    },

    "png": {
        "header": b"\x89PNG\r\n\x1a\n",
        "footer": b"IEND",
        "extension": ".png",
        "mime_type": "image/png",
    },

    "pdf": {
        "header": b"%PDF-",
        "footer": b"%%EOF",
        "extension": ".pdf",
        "mime_type": "application/pdf",
    },
}


def detect_file_type(data: bytes) -> str | None:
    """
    Detect a file type from the beginning of binary data.
    """

    for file_type, signature in FILE_SIGNATURES.items():
        if data.startswith(signature["header"]):
            return file_type

    return None