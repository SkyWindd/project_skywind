import requests

BASE_URL = "http://localhost:5001"


def test_get_products_integration():

    response = requests.get(
        f"{BASE_URL}/api/products"
    )

    assert response.status_code == 200



def test_get_product_by_id_integration():

    response = requests.get(
        f"{BASE_URL}/api/products/1"
    )

    assert response.status_code in [200, 404]



def test_create_product_integration():

    payload = {
        "name": "Integration Product",
        "price": 100000,
        "sale_price": 80000,
        "stock": 10,
    }

    response = requests.post(
        f"{BASE_URL}/api/products",
        json=payload,
    )

    assert response.status_code in [200, 201]



def test_update_product_integration():

    payload = {
        "name": "Updated Integration Product"
    }

    response = requests.put(
        f"{BASE_URL}/api/products/1",
        json=payload,
    )

    assert response.status_code in [200, 404]



def test_delete_product_integration():

    response = requests.delete(
        f"{BASE_URL}/api/products/1"
    )

    assert response.status_code in [200, 204, 404]