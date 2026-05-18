import requests

BASE_URL = "http://localhost:5002"


def test_inventory_contract():

    response = requests.get(
        f"{BASE_URL}/api/inventory",
        params={
            "skuCode": 1
        }
    )

    assert response.status_code == 200

    data = response.json()

    # response phải là list
    assert isinstance(data, list)

    # phải có dữ liệu
    assert len(data) > 0

    item = data[0]

    # contract fields
    assert "skuCode" in item

    assert "isInStock" in item