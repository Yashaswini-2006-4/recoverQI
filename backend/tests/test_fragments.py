from app.core.fragments import Fragment, create_fragments


def test_fragment_creation():

    data = b"JPEG DATA"

    carved_file = {
        "file_type": "jpeg",
        "start_offset": 100,
        "end_offset": 109,
        "size": 9,
        "data": data,
    }

    fragments = create_fragments([carved_file])

    assert len(fragments) == 1

    fragment = fragments[0]

    assert fragment.fragment_id == 1
    assert fragment.file_type == "jpeg"
    assert fragment.start_offset == 100
    assert fragment.end_offset == 109
    assert fragment.size == 9
    assert fragment.is_valid is True


def test_invalid_fragment():

    fragment = Fragment(
        fragment_id=1,
        file_type="jpeg",
        start_offset=100,
        end_offset=90,
        size=10,
        data=b"1234567890",
    )

    assert fragment.is_valid is False