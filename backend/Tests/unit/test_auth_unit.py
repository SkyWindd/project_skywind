from unittest.mock import patch, MagicMock
from server import app
from routes.auth import login_user, register, require_admin
import pytest


# =====================================================
# AUTH_01 – LOGIN THÀNH CÔNG
# =====================================================
@patch("routes.auth.get_connection")
@patch("routes.auth.check_password_hash")
def test_login_user_success(mock_check_password, mock_get_conn):
    mock_check_password.return_value = True

    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchone.return_value = {
        "user_id": 1,
        "username": "test",
        "email": "test@gmail.com",
        "password": "hashed_pw",
        "role": "user",
        "is_active": True
    }

    payload = {
        "email": "test@gmail.com",
        "password": "123456"
    }

    with app.test_request_context(
        "/api/auth/login",
        method="POST",
        json=payload
    ):
        response, status = login_user()

    assert status == 200
    assert response.json["success"] is True
    assert response.json["user"]["email"] == "test@gmail.com"


# =====================================================
# AUTH_02 – LOGIN SAI MẬT KHẨU
# =====================================================
@patch("routes.auth.get_connection")
@patch("routes.auth.check_password_hash")
def test_login_user_wrong_password(mock_check_password, mock_get_conn):
    mock_check_password.return_value = False

    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchone.return_value = {
        "user_id": 1,
        "username": "test",
        "email": "test@gmail.com",
        "password": "hashed_pw",
        "role": "user",
        "is_active": True
    }

    payload = {
        "email": "test@gmail.com",
        "password": "sai"
    }

    with app.test_request_context(
        "/api/auth/login",
        method="POST",
        json=payload
    ):
        response, status = login_user()

    assert status == 400
    assert response.json["success"] is False


# =====================================================
# AUTH_03 – REGISTER THÀNH CÔNG
# =====================================================
@patch("routes.auth.get_connection")
def test_register_success(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    # 1️⃣ Check email tồn tại → None
    # 2️⃣ Insert user → trả user_id
    mock_cursor.fetchone.side_effect = [
        None,
        {"user_id": 10}
    ]

    payload = {
        "username": "newuser",
        "email": "new@gmail.com",
        "password": "123456"
    }

    with app.test_request_context(
        "/api/auth/register",
        method="POST",
        json=payload
    ):
        response, status = register()

    assert status == 201
    assert response.json["success"] is True
    assert response.json["user"]["email"] == "new@gmail.com"


# =====================================================
# AUTH_04 – PHÂN QUYỀN ADMIN
# =====================================================
def test_require_admin_success():
    user = {"role": "admin"}
    assert require_admin(user) is True


def test_require_admin_forbidden():
    user = {"role": "user"}
    with pytest.raises(PermissionError):
        require_admin(user)
