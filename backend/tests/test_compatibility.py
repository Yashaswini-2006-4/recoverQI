from app.core.fragments import Fragment
from app.core.compatibility import (
    are_compatible,
    calculate_compatibility_score,
)


def make_fragment(
    fragment_id,
    file_type,
    start,
    end
):
    return Fragment(
        fragment_id=fragment_id,
        file_type=file_type,
        start_offset=start,
        end_offset=end,
        size=end - start,
        data=b"x" * (end - start),
    )


def test_compatible_fragments():

    first = make_fragment(
        1,
        "jpeg",
        100,
        200
    )

    second = make_fragment(
        2,
        "jpeg",
        200,
        300
    )

    assert are_compatible(first, second) is True


def test_different_file_types_are_not_compatible():

    first = make_fragment(
        1,
        "jpeg",
        100,
        200
    )

    second = make_fragment(
        2,
        "png",
        200,
        300
    )

    assert are_compatible(first, second) is False


def test_overlapping_fragments_are_not_compatible():

    first = make_fragment(
        1,
        "jpeg",
        100,
        250
    )

    second = make_fragment(
        2,
        "jpeg",
        200,
        300
    )

    assert are_compatible(first, second) is False


def test_compatibility_score():

    first = make_fragment(
        1,
        "jpeg",
        100,
        200
    )

    second = make_fragment(
        2,
        "jpeg",
        200,
        300
    )

    score = calculate_compatibility_score(
        first,
        second
    )

    assert score == 1.0