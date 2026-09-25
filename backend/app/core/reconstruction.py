"""
Fragment reconstruction engine for RecoverIQ.

Builds recovered files from compatible fragments and
supports reconstruction of multiple file types independently.
"""

from .fragments import Fragment
from .compatibility import (
    are_compatible,
    calculate_compatibility_score,
)


def order_fragments(
    fragments: list[Fragment],
) -> list[Fragment]:
    """
    Order fragments according to their position
    in the original binary data.
    """

    return sorted(
        fragments,
        key=lambda fragment: fragment.start_offset,
    )


def reconstruct_file(
    fragments: list[Fragment],
) -> bytes:
    """
    Reconstruct a single file from its fragments.

    All fragments must belong to the same file type.
    """

    if not fragments:
        return b""

    ordered = order_fragments(fragments)

    file_type = ordered[0].file_type

    # Prevent mixing different file types.
    if any(
        fragment.file_type != file_type
        for fragment in ordered
    ):
        raise ValueError(
            "All fragments must belong to the same file type."
        )

    reconstructed = bytearray()

    for fragment in ordered:
        reconstructed.extend(fragment.data)

    return bytes(reconstructed)


def reconstruction_score(
    fragments: list[Fragment],
) -> float:
    """
    Calculate an overall compatibility score
    for a reconstruction.

    Returns a value between 0.0 and 1.0.
    """

    if not fragments:
        return 0.0

    if len(fragments) == 1:
        return 1.0

    ordered = order_fragments(fragments)

    scores = []

    for first, second in zip(
        ordered,
        ordered[1:],
    ):
        if not are_compatible(first, second):
            return 0.0

        score = calculate_compatibility_score(
            first,
            second,
        )

        scores.append(score)

    if not scores:
        return 0.0

    return sum(scores) / len(scores)


def reconstruct_by_file_type(
    fragments: list[Fragment],
) -> dict[str, dict]:
    """
    Group fragments by file type and reconstruct
    each file type independently.

    Example:

        JPEG fragments -> JPEG reconstruction
        PDF fragments  -> PDF reconstruction
        PNG fragments  -> PNG reconstruction

    Returns:
        Dictionary containing reconstructed data,
        size, confidence score, and fragment IDs.
    """

    groups: dict[str, list[Fragment]] = {}

    for fragment in fragments:
        groups.setdefault(
            fragment.file_type,
            [],
        ).append(fragment)

    results: dict[str, dict] = {}

    for file_type, group in groups.items():

        reconstructed = reconstruct_file(group)

        score = reconstruction_score(group)

        results[file_type] = {
            "data": reconstructed,
            "size": len(reconstructed),
            "confidence_score": score,
            "fragment_ids": [
                fragment.fragment_id
                for fragment in group
            ],
        }

    return results