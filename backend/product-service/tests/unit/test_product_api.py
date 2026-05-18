import pytest
from flask import Flask, jsonify, request


@pytest.fixture
def client():

    app = Flask(__name__)

    products = [
        {
            "product_id": 1,
            "name": "Test Product",
            "price": 100000,
            "sale_price": 80000,
            "stock": 10,
        }
    ]

    @app.route("/api/products", methods=["GET"])
    def get_products():
        return jsonify(products), 200


    @app.route("/api/products/<int:product_id>", methods=["GET"])
    def get_product(product_id):

        for product in products:
            if product["product_id"] == product_id:
                return jsonify(product), 200

        return jsonify({"message": "Product not found"}), 404


    @app.route("/api/products", methods=["POST"])
    def create_product():

        data = request.json

        products.append(data)

        return jsonify({"message": "Product created"}), 201


    @app.route("/api/products/<int:product_id>", methods=["PUT"])
    def update_product(product_id):

        data = request.json

        for product in products:
            if product["product_id"] == product_id:
                product.update(data)
                return jsonify({"message": "Updated"}), 200

        return jsonify({"message": "Product not found"}), 404


    @app.route("/api/products/<int:product_id>", methods=["DELETE"])
    def delete_product(product_id):

        for product in products:
            if product["product_id"] == product_id:
                products.remove(product)
                return jsonify({"message": "Deleted"}), 200

        return jsonify({"message": "Product not found"}), 404


    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client



def test_get_products(client):

    response = client.get("/api/products")

    assert response.status_code == 200



def test_get_product_by_id(client):

    response = client.get("/api/products/1")

    assert response.status_code == 200



def test_product_not_found(client):

    response = client.get("/api/products/999")

    assert response.status_code == 404



def test_create_product(client):

    payload = {
        "product_id": 2,
        "name": "Keyboard",
        "price": 500000,
        "sale_price": 450000,
        "stock": 5,
    }

    response = client.post(
        "/api/products",
        json=payload,
    )

    assert response.status_code == 201



def test_update_product(client):

    payload = {
        "name": "Updated Product"
    }

    response = client.put(
        "/api/products/1",
        json=payload,
    )

    assert response.status_code == 200



def test_delete_product(client):

    response = client.delete(
        "/api/products/1"
    )

    assert response.status_code == 200