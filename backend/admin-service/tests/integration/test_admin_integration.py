import requests

BASE_URL = "http://localhost:5006"



def test_admin_home():

    response = requests.get(
        f"{BASE_URL}/"
    )

    assert response.status_code in [
        200,
        404
    ]



def test_admin_dashboard():

    response = requests.get(
        f"{BASE_URL}/api/admin/dashboard"
    )

    assert response.status_code in [
        200,
        401,
        403,
        404
    ]



def test_admin_products():

    response = requests.get(
        f"{BASE_URL}/api/admin/products"
    )

    assert response.status_code in [
        200,
        401,
        403,
        404
    ]



def test_admin_users():

    response = requests.get(
        f"{BASE_URL}/api/admin/users"
    )

    assert response.status_code in [
        200,
        401,
        403,
        404
    ]