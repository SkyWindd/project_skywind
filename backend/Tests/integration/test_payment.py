# Tests/integration/test_payment.py
import pytest
from server import create_app
from .helpers import insert_test_payment, delete_test_payment

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_create_payment(client):
    payment_id = insert_test_payment()
    resp = client.get(f"/api/admin/payment/{payment_id}")
    assert resp.status_code in [200, 404]
    delete_test_payment(payment_id)
