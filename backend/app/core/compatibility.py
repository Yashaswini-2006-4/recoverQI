"""
Fragment compatibility logic for RecoverIQ.

Determines whether two fragments can potentially belong
to the same recovered file.
"""

from .fragments import Fragment


def are_compatible(
    first: Fragment,
    second: Fragment
) -> bool:
    """
    Determine whether two fragments can potentially
    belong to the same file.

    Current rules:
    1. Both fragments must have the same file type.
    2. They must not overlap in the original binary data.
    3. The second fragment must occur after the first.
    """

    if first.file_type != second.file_type:
        return False

    if first.end_offset > second.start_offset:
        return False

    if second.start_offset <= first.start_offset:
        return False

    return True


def calculate_compatibility_score(
    first: Fragment,
    second: Fragment
) -> float:
    """
    Calculate a basic compatibility score between
    two fragments.

    Returns a value between 0.0 and 1.0.
    """

    if not are_compatible(first, second):
        return 0.0

    # Higher score when fragments are close together.
    distance = second.start_offset - first.end_offset

    if distance == 0:
        return 1.0

    if distance <= 1024:
        return 0.9

    if distance <= 4096:
        return 0.7

    if distance <= 16384:
        return 0.5

    return 0.2