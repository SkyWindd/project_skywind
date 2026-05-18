import requests

BASE_URL = "http://localhost:5001"


def test_product_contract():

    response = requests.get(
        f"{BASE_URL}/api/products"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    if len(data) > 0:

        product = data[0]

        assert "product_id" in product

        assert "name" in product

        assert "price" in product