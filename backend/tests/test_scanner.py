import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.scanner import scan_for_signatures


class TestScanner(unittest.TestCase):
    def test_signature_scanner(self):
        data = (
            b"RANDOM DATA"
            + b"\xFF\xD8\xFF"
            + b"MORE DATA"
            + b"\x89PNG\r\n\x1a\n"
            + b"MORE DATA"
            + b"%PDF-"
        )

        results = scan_for_signatures(data)

        self.assertEqual(len(results), 3)
        self.assertEqual(results[0]["file_type"], "jpeg")
        self.assertEqual(results[1]["file_type"], "png")
        self.assertEqual(results[2]["file_type"], "pdf")


if __name__ == "__main__":
    unittest.main()