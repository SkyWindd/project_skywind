import requests

BASE_URL = "http://127.0.0.1:5000"

def get_user_token():
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "email": "3122411074@gmail.com",
            "password": "123456"
        }
    )
    return response.json()["accessToken"]


def get_admin_token():
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "email": "giahung10092004@gmail.com",
            "password": "444444"
        }
    )
    return response.json()["accessToken"]


def test_user_cannot_access_admin_api():
    token = get_user_token()
    response = requests.get(
        f"{BASE_URL}/api/admin/products",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403


def test_admin_can_access_admin_api():
    token = get_admin_token()
    response = requests.get(
        f"{BASE_URL}/api/admin/products",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
