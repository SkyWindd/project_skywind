import pytest



def test_email_not_empty():

    email = "test@gmail.com"

    assert email != ""



def test_password_not_empty():

    password = "123456"

    assert password != ""



def test_password_length():

    password = "123456"

    assert len(password) >= 6



def test_login_success():

    email = "test@gmail.com"
    password = "123456"

    assert email == "test@gmail.com"
    assert password == "123456"



def test_wrong_password():

    password = "wrongpassword"

    assert password != "123456"