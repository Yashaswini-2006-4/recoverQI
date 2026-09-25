from app.core.scanner import scan_for_signatures


def test_signature_scanner():
    data = (
        b"RANDOM DATA"
        + b"\xFF\xD8\xFF"
        + b"MORE DATA"
        + b"\x89PNG\r\n\x1a\n"
        + b"MORE DATA"
        + b"%PDF-"
    )

    results = scan_for_signatures(data)

    assert len(results) == 3

    assert results[0]["file_type"] == "jpeg"
    assert results[1]["file_type"] == "png"
    assert results[2]["file_type"] == "pdf"