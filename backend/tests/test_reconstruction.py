from app.core.fragments import Fragment
from app.core.reconstruction import (
    order_fragments,
    reconstruct_file,
    reconstruction_score,
)


def make_fragment(
    fragment_id,
    start,
    end,
    data
):
    return Fragment(
        fragment_id=fragment_id,
        file_type="jpeg",
        start_offset=start,
        end_offset=end,
        size=len(data),
        data=data,
    )


def test_fragments_are_ordered():

    fragment_2 = make_fragment(
        2,
        200,
        300,
        b"BBB"
    )

    fragment_1 = make_fragment(
        1,
        100,
        200,
        b"AAA"
    )

    ordered = order_fragments(
        [fragment_2, fragment_1]
    )

    assert ordered[0].fragment_id == 1
    assert ordered[1].fragment_id == 2


def test_file_reconstruction():

    fragment_1 = make_fragment(
        1,
        100,
        103,
        b"AAA"
    )

    fragment_2 = make_fragment(
        2,
        103,
        106,
        b"BBB"
    )

    result = reconstruct_file(
        [fragment_1, fragment_2]
    )

    assert result == b"AAABBB"


def test_reconstruction_score():

    fragment_1 = make_fragment(
        1,
        100,
        103,
        b"AAA"
    )

    fragment_2 = make_fragment(
        2,
        103,
        106,
        b"BBB"
    )

    score = reconstruction_score(
        [fragment_1, fragment_2]
    )

    assert score == 1.0


def test_empty_reconstruction():

    result = reconstruct_file([])

    assert result == b""
def test_reconstruct_by_file_type():

    jpeg_fragment = make_fragment(
        1,
        100,
        103,
        b"JPEG"
    )

    pdf_fragment = Fragment(
        fragment_id=2,
        file_type="pdf",
        start_offset=200,
        end_offset=203,
        size=3,
        data=b"PDF",
    )

    from app.core.reconstruction import reconstruct_by_file_type

    results = reconstruct_by_file_type(
        [jpeg_fragment, pdf_fragment]
    )

    assert "jpeg" in results
    assert "pdf" in results

    assert results["jpeg"]["data"] == b"JPEG"
    assert results["pdf"]["data"] == b"PDF"