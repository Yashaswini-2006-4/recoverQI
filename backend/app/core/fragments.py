"""
Fragment representation and discovery for RecoverIQ.
"""

from dataclasses import dataclass


@dataclass
class Fragment:
    """
    Represents a fragment discovered inside binary data.
    """

    fragment_id: int
    file_type: str
    start_offset: int
    end_offset: int
    size: int
    data: bytes

    @property
    def is_valid(self) -> bool:
        """
        Basic validation for a fragment.
        """

        return (
            self.start_offset >= 0
            and self.end_offset > self.start_offset
            and self.size > 0
            and len(self.data) == self.size
        )


def create_fragments(carved_files: list[dict]) -> list[Fragment]:
    """
    Convert carved file candidates into Fragment objects.
    """

    fragments = []

    for index, candidate in enumerate(carved_files, start=1):

        fragment = Fragment(
            fragment_id=index,
            file_type=candidate["file_type"],
            start_offset=candidate["start_offset"],
            end_offset=candidate["end_offset"],
            size=candidate["size"],
            data=candidate["data"],
        )

        if fragment.is_valid:
            fragments.append(fragment)

    return fragments