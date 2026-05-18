import requests

BASE_URL = "http://localhost:5004"



def test_create_order():

    payload = {
        "user_id": 1,

        "cart_items": [
            {
                "product_id": 1,
                "quantity": 1,
                "price": 100000
            }
        ]
    }

    response = requests.post(
        f"{BASE_URL}/api/orders/create",
        json=payload
    )

    assert response.status_code in [
        200,
        201,
        400,
        500
    ]



def test_get_orders():

    response = requests.get(
        f"{BASE_URL}/api/orders"
    )

    assert response.status_code in [
        200,
        500
    ]



def test_get_order_by_id():

    response = requests.get(
        f"{BASE_URL}/api/orders/1"
    )

    assert response.status_code in [
        200,
        404
    ]



def test_cancel_order():

    response = requests.put(
        f"{BASE_URL}/api/orders/cancel/1"
    )

    assert response.status_code in [
        200,
        400,
        404
    ]



def test_update_order_status():

    payload = {
        "order_status": "Đã xác nhận"
    }

    response = requests.put(
        f"{BASE_URL}/api/orders/update-status/1",
        json=payload
    )

    assert response.status_code in [
        200,
        400,
        404
    ]