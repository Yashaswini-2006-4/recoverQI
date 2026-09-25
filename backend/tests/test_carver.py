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