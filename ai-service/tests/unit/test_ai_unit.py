def fake_ai_response(text):

    return f"AI: {text}"



def test_fake_ai_response():

    result = fake_ai_response(
        "hello"
    )

    assert (
        result ==
        "AI: hello"
    )