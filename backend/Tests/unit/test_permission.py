import pytest
from routes.auth import require_admin

def test_admin_can_access():
    user = {"user_id": 1, "role": "admin"}
    assert require_admin(user) is True


def test_user_cannot_access():
    user = {"user_id": 2, "role": "user"}
    with pytest.raises(PermissionError):
        require_admin(user)


def test_none_user_cannot_access():
    with pytest.raises(PermissionError):
        require_admin(None)
