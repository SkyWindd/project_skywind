import requests

BASE_URL = "http://localhost:5005"


def test_auth_login_contract():

    payload = {
        "email": "test@gmail.com",
        "password": "123456"
    }

    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=payload
    )

    assert response.status_code in [200, 401]

    if response.status_code == 200:

        data = response.json()

        assert "success" in data

        assert "accessToken" in data

        assert "refreshToken" in data

        assert "user" in data