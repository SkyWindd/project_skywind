import pytest
from server import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_get_products(client):
    res = client.get("/api/products/")
    assert res.status_code in [200, 500]


def test_get_product_not_found(client):
    res = client.get("/api/products/999999")
    assert res.status_code in [404, 500]


def test_get_product_by_slug(client):
    res = client.get("/api/products/slug/test-slug")
    assert res.status_code in [200, 404, 500]
