import uuid
import requests

BASE_URL = "http://localhost:5005"


def test_register():

    random_email = f"test_{uuid.uuid4()}@gmail.com"

    payload = {
        "username": "testuser",
        "email": random_email,
        "password": "123456"
    }

    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json=payload
    )

    assert response.status_code in [200, 201]



def test_login():

    payload = {
        "email": "test@gmail.com",
        "password": "123456"
    }

    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=payload
    )

    assert response.status_code in [200, 401]



def test_login_wrong_password():

    payload = {
        "email": "test@gmail.com",
        "password": "wrongpassword"
    }

    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=payload
    )

    assert response.status_code in [400, 401]



def test_home():

    response = requests.get(
        f"{BASE_URL}/"
    )

    assert response.status_code == 200