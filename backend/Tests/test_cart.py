import requests

BASE_URL = "http://127.0.0.1:5000"

def get_user_token():
    res = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "email": "3122411074@gmail.com",
            "password": "123456"
        }
    )
    return res.json()["accessToken"]
def test_get_cart_by_user_id():
    response = requests.get(f"{BASE_URL}/api/cart/1")
    assert response.status_code == 200
    assert "items" in response.json()

def test_add_to_cart():
    response = requests.post(
        f"{BASE_URL}/api/cart/add",
        json={
            "user_id": 1,
            "product_id": 1,
            "quantity": 2
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert "added_quantity" in data
def test_update_cart_item():
    response = requests.put(
        f"{BASE_URL}/api/cart/update",
        json={
            "user_id": 1,
            "product_id": 1,
            "quantity": 5
        }
    )

    assert response.status_code == 200
def test_remove_from_cart():
    response = requests.delete(
        f"{BASE_URL}/api/cart/remove",
        json={
            "user_id": 1,
            "product_id": 1
        }
    )

    assert response.status_code == 200
def test_clear_cart():
    response = requests.delete(f"{BASE_URL}/api/cart/clear/1")
    assert response.status_code == 200
