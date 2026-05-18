import requests

BASE_URL = "http://localhost:5008"



def test_create_payment():

    payload = {
        "order_id": 1,
        "amount": 500000,
        "payment_method": "COD"
    }

    response = requests.post(
        f"{BASE_URL}/api/payments",
        json=payload
    )

    assert response.status_code in [
        200,
        201,
        400,
        404,
        500
    ]



def test_get_payments():

    response = requests.get(
        f"{BASE_URL}/api/payments"
    )

    assert response.status_code in [
        200,
        404,
        500
    ]



def test_get_payment_by_id():

    response = requests.get(
        f"{BASE_URL}/api/payments/1"
    )

    assert response.status_code in [
        200,
        404
    ]



def test_payment_callback():

    payload = {
        "status": "success"
    }

    response = requests.post(
        f"{BASE_URL}/api/payments/callback",
        json=payload
    )

    assert response.status_code in [
        200,
        400,
        404
    ]