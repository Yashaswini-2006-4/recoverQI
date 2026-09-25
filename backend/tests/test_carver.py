import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.carver import carve_files


class TestCarver(unittest.TestCase):
    def test_carve_jpeg(self):
        fake_jpeg = (
            b"RANDOM DATA"
            + b"\xFF\xD8\xFF"
            + b"JPEG CONTENT"
            + b"\xFF\xD9"
            + b"MORE RANDOM DATA"
        )

        results = carve_files(fake_jpeg)

        self.assertEqual(len(results), 1)
        recovered = results[0]
        self.assertEqual(recovered["file_type"], "jpeg")
        self.assertGreater(recovered["size"], 0)

    def test_carve_pdf(self):
        fake_pdf = (
            b"RANDOM DATA"
            + b"%PDF-1.7"
            + b"PDF CONTENT"
            + b"%%EOF"
        )

        results = carve_files(fake_pdf)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["file_type"], "pdf")


if __name__ == "__main__":
    unittest.main()
from app.core.carver import carve_files


def test_carve_complete_jpeg():
    data = (
        b"RANDOM"
        + b"\xFF\xD8\xFF"
        + b"JPEG DATA"
        + b"\xFF\xD9"
        + b"END"
    )

    results = carve_files(data)

    assert len(results) == 1

    recovered = results[0]

    assert recovered["file_type"] == "jpeg"
    assert recovered["is_complete"] is True
    assert recovered["data"].startswith(b"\xFF\xD8\xFF")
    assert recovered["data"].endswith(b"\xFF\xD9")


def test_carve_partial_jpeg():
    data = (
        b"RANDOM"
        + b"\xFF\xD8\xFF"
        + b"INCOMPLETE JPEG DATA"
    )

    results = carve_files(data)

    assert len(results) == 1

    recovered = results[0]

    assert recovered["file_type"] == "jpeg"
    assert recovered["is_complete"] is False
    assert recovered["data"].startswith(b"\xFF\xD8\xFF")
    assert recovered["data"] == data[6:]


def test_carve_complete_pdf():
    data = (
        b"RANDOM"
        + b"%PDF-1.7"
        + b"PDF DATA"
        + b"%%EOF"
    )

    results = carve_files(data)

    assert len(results) == 1

    recovered = results[0]

    assert recovered["file_type"] == "pdf"
    assert recovered["is_complete"] is True
    assert recovered["data"].startswith(b"%PDF-")
    assert recovered["data"].endswith(b"%%EOF")


def test_carve_partial_pdf():
    data = (
        b"RANDOM"
        + b"%PDF-1.7"
        + b"INCOMPLETE PDF DATA"
    )

    results = carve_files(data)

    assert len(results) == 1

    recovered = results[0]

    assert recovered["file_type"] == "pdf"
    assert recovered["is_complete"] is False
    assert recovered["data"].startswith(b"%PDF-")


def test_carve_multiple_files():
    data = (
        b"START"
        + b"\xFF\xD8\xFF"
        + b"JPEG"
        + b"\xFF\xD9"
        + b"MIDDLE"
        + b"%PDF-1.7"
        + b"PDF"
        + b"%%EOF"
    )

    results = carve_files(data)

    assert len(results) == 2

    assert results[0]["file_type"] == "jpeg"
    assert results[1]["file_type"] == "pdf"

    assert results[0]["is_complete"] is True
    assert results[1]["is_complete"] is True
