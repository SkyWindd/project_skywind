import pytest
from routes.auth import verify_password
from unittest.mock import patch

def test_verify_password_correct():
    with patch("routes.auth.check_password_hash") as mock_check:
        mock_check.return_value = True
        assert verify_password("123456", "hashed_pw") is True


def test_verify_password_wrong():
    with patch("routes.auth.check_password_hash") as mock_check:
        mock_check.return_value = False
        assert verify_password("sai", "hashed_pw") is False
