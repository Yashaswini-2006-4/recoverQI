import hashlib
import unittest

from recoveriq.candidate_evaluator import (
    calculate_sha256,
    detect_file_format,
    evaluate_candidate,
    evaluate_reconstruction_candidates,
    generate_recovery_report,
    verify_sha256,
)


def make_candidate(file_type, data):
    return {
        "file_type": file_type,
        "start_offset": 10,
        "end_offset": 10 + len(data),
        "size": len(data),
        "data": data,
    }


class TestCandidateEvaluator(unittest.TestCase):

    def test_detects_pdf(self):
        data = b"%PDF-1.7 example %%EOF"
        self.assertEqual(detect_file_format(data), "PDF")

    def test_detects_png(self):
        data = (
            b"\x89PNG\r\n\x1a\n"
            + b"example image data"
            + b"\x49\x45\x4E\x44\xAE\x42\x60\x82"
        )
        self.assertEqual(detect_file_format(data), "PNG")

    def test_detects_jpeg(self):
        data = b"\xFF\xD8\xFFexample image\xFF\xD9"
        self.assertEqual(detect_file_format(data), "JPEG")

    def test_unknown_format(self):
        self.assertEqual(detect_file_format(b"random data"), "UNKNOWN")

    def test_sha256_matches_known_value(self):
        self.assertEqual(
            calculate_sha256(b"hello"),
           "2cf24dba5fb0a30e26e83b2ac5b9e29e"
            "1b161e5c1fa7425e73043362938b9824",
        )

    def test_hash_verification(self):
        data = b"RecoverIQ"
        expected = hashlib.sha256(data).hexdigest()

        self.assertTrue(verify_sha256(data, expected))
        self.assertFalse(verify_sha256(data, "0" * 64))

    def test_valid_pdf_candidate(self):
        data = b"%PDF-1.7 example %%EOF"
        result = evaluate_candidate(make_candidate("pdf", data))

        self.assertEqual(result["detected_format"], "PDF")
        self.assertTrue(result["format_matches"])
        self.assertTrue(result["header_valid"])
        self.assertTrue(result["footer_valid"])
        self.assertTrue(result["is_complete_by_signatures"])
        self.assertEqual(
            result["integrity_status"],
            "SIGNATURES_AND_METADATA_VALID",
        )
        self.assertEqual(result["recovery_priority"], "HIGH")

    def test_format_mismatch(self):
        data = b"%PDF-1.7 example %%EOF"
        result = evaluate_candidate(make_candidate("png", data))

        self.assertFalse(result["format_matches"])
        self.assertEqual(result["integrity_status"], "FORMAT_MISMATCH")

    def test_missing_footer(self):
        data = b"%PDF-1.7 incomplete"
        result = evaluate_candidate(make_candidate("pdf", data))

        self.assertFalse(result["footer_valid"])
        self.assertEqual(
            result["integrity_status"],
            "INCOMPLETE_SIGNATURES",
        )

    def test_inconsistent_offsets(self):
        data = b"%PDF-1.7 example %%EOF"
        candidate = make_candidate("pdf", data)
        candidate["end_offset"] += 5

        result = evaluate_candidate(candidate)

        self.assertFalse(result["offsets_valid"])
        self.assertEqual(
            result["integrity_status"],
            "METADATA_INCONSISTENT",
        )

    def test_inconsistent_size(self):
        data = b"%PDF-1.7 example %%EOF"
        candidate = make_candidate("pdf", data)
        candidate["size"] += 1

        result = evaluate_candidate(candidate)

        self.assertFalse(result["size_matches"])

    def test_expected_hash_mismatch(self):
        data = b"%PDF-1.7 example %%EOF"
        result = evaluate_candidate(
            make_candidate("pdf", data),
            expected_sha256="0" * 64,
        )

        self.assertFalse(result["hash_verified"])
        self.assertEqual(result["integrity_status"], "HASH_MISMATCH")

    def test_empty_candidate(self):
        result = evaluate_candidate(make_candidate("pdf", b""))

        self.assertEqual(result["integrity_status"], "EMPTY")
        self.assertEqual(result["recovery_priority"], "LOW")

    def test_rejects_non_bytes_data(self):
        candidate = make_candidate("pdf", b"")
        candidate["data"] = "not bytes"

        with self.assertRaises(TypeError):
            evaluate_candidate(candidate)

    def test_prioritizes_candidates(self):
        valid = make_candidate("pdf", b"%PDF-1.7 example %%EOF")
        unknown = make_candidate("unknown", b"random data")

        results = evaluate_reconstruction_candidates([unknown, valid])

        self.assertEqual(results[0]["recovery_priority"], "HIGH")
        self.assertEqual(results[0]["candidate_index"], 1)

    def test_generates_report(self):
        candidate = make_candidate("pdf", b"%PDF-1.7 example %%EOF")
        report = generate_recovery_report([candidate])

        self.assertEqual(report["project"], "RecoverIQ")
        self.assertEqual(report["total_candidates"], 1)
        self.assertEqual(report["priority_summary"]["high"], 1)
        self.assertEqual(len(report["candidates"]), 1)
        self.assertIn("limitations", report)


if __name__ == "__main__":
    unittest.main()