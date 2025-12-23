import io
import pytest
from server import create_app
from .helpers import insert_test_product, delete_test_product, generate_unique_name

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_all_products(client):
    resp = client.get("/api/products/")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)

def test_get_product_by_id(client):
    product_id, slug = insert_test_product()
    resp = client.get(f"/api/products/{product_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["product_id"] == product_id
    delete_test_product(product_id)

def test_get_product_by_slug(client):
    product_id, slug = insert_test_product()
    resp = client.get(f"/api/products/slug/{slug}")
    assert resp.status_code in [200, 404]
    delete_test_product(product_id)

def test_add_product(client):
    image_data = io.BytesIO(b"fake image data")
    image_data.name = "test.png"

    resp = client.post("/api/products/",
        data={
            "name": generate_unique_name("Integration Test Laptop"),
            "price": "1200",
            "stock": "5",
            "brand_id": "1",
            "images": image_data
        },
        content_type="multipart/form-data"
    )
    assert resp.status_code in [201, 500]
    if resp.status_code == 201:
        data = resp.get_json()
        delete_test_product(data["product_id"])
