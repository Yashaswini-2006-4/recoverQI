import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.fragments import Fragment, create_fragments


class TestFragments(unittest.TestCase):
    def test_fragment_creation(self):
        data = b"JPEG DATA"
        carved_file = {
            "file_type": "jpeg",
            "start_offset": 100,
            "end_offset": 109,
            "size": 9,
            "data": data,
        }

        fragments = create_fragments([carved_file])

        self.assertEqual(len(fragments), 1)
        fragment = fragments[0]

        self.assertEqual(fragment.fragment_id, 1)
        self.assertEqual(fragment.file_type, "jpeg")
        self.assertEqual(fragment.start_offset, 100)
        self.assertEqual(fragment.end_offset, 109)
        self.assertEqual(fragment.size, 9)
        self.assertTrue(fragment.is_valid)

    def test_invalid_fragment(self):
        fragment = Fragment(
            fragment_id=1,
            file_type="jpeg",
            start_offset=100,
            end_offset=90,
            size=10,
            data=b"1234567890",
        )

        self.assertFalse(fragment.is_valid)


if __name__ == "__main__":
    unittest.main()