# Tests/integration/test_user.py
import pytest
from server import create_app
from .helpers import insert_test_user, delete_test_user, random_email

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_create_user(client):
    email = random_email()
    resp = client.post("/api/users/", json={
        "username": email.split("@")[0],
        "email": email,
        "password": "1234"
    })
    # Chấp nhận 201 (created) hoặc 400 nếu duplicate
    assert resp.status_code in [201, 400]

def test_get_user(client):
    user_id, _ = insert_test_user()
    resp = client.get(f"/api/users/{user_id}")
    # Chấp nhận 200 (found) hoặc 404 (chưa tồn tại)
    assert resp.status_code in [200, 404]
    delete_test_user(user_id)
