from app.core.fragments import Fragment
from app.core.compatibility import (
    are_compatible,
    calculate_compatibility_score,
    build_compatibility_graph,
)


def create_fragment(
    fragment_id,
    file_type,
    start,
    end,
):
    data = b"A" * (end - start)

    return Fragment(
        fragment_id=fragment_id,
        file_type=file_type,
        start_offset=start,
        end_offset=end,
        size=end - start,
        data=data,
    )


def test_compatible_fragments():
    first = create_fragment(
        1,
        "jpeg",
        0,
        100,
    )

    second = create_fragment(
        2,
        "jpeg",
        100,
        200,
    )

    assert are_compatible(
        first,
        second,
    )


def test_incompatible_file_types():
    first = create_fragment(
        1,
        "jpeg",
        0,
        100,
    )

    second = create_fragment(
        2,
        "pdf",
        100,
        200,
    )

    assert not are_compatible(
        first,
        second,
    )


def test_overlapping_fragments_are_incompatible():
    first = create_fragment(
        1,
        "jpeg",
        0,
        100,
    )

    second = create_fragment(
        2,
        "jpeg",
        50,
        150,
    )

    assert not are_compatible(
        first,
        second,
    )


def test_compatibility_score():
    first = create_fragment(
        1,
        "jpeg",
        0,
        100,
    )

    second = create_fragment(
        2,
        "jpeg",
        100,
        200,
    )

    score = calculate_compatibility_score(
        first,
        second,
    )

    assert score == 1.0


def test_build_compatibility_graph():
    first = create_fragment(
        1,
        "jpeg",
        0,
        100,
    )

    second = create_fragment(
        2,
        "jpeg",
        100,
        200,
    )

    third = create_fragment(
        3,
        "jpeg",
        200,
        300,
    )

    pdf = create_fragment(
        4,
        "pdf",
        300,
        400,
    )

    graph = build_compatibility_graph(
        [
            first,
            second,
            third,
            pdf,
        ]
    )

    assert 1 in graph
    assert 2 in graph
    assert 3 in graph
    assert 4 in graph

    assert graph[1][0]["fragment_id"] == 2
    assert graph[1][0]["score"] == 1.0

    assert graph[2][0]["fragment_id"] == 3

    # JPEG fragments must not connect to PDF.
    assert all(
        edge["fragment_id"] != 4
        for edge in graph[1]
    )