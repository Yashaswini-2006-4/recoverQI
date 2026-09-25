from app.core.carver import carve_files


def test_carve_jpeg():

    fake_jpeg = (
        b"RANDOM DATA"
        + b"\xFF\xD8\xFF"
        + b"JPEG CONTENT"
        + b"\xFF\xD9"
        + b"MORE RANDOM DATA"
    )

    results = carve_files(fake_jpeg)

    assert len(results) == 1

    recovered = results[0]

    assert recovered["file_type"] == "jpeg"
    assert recovered["size"] > 0


def test_carve_pdf():

    fake_pdf = (
        b"RANDOM DATA"
        + b"%PDF-1.7"
        + b"PDF CONTENT"
        + b"%%EOF"
    )

    results = carve_files(fake_pdf)

    assert len(results) == 1

    assert results[0]["file_type"] == "pdf"