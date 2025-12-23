from unittest.mock import patch, MagicMock
from server import app
from routes.order import (
    create_order,
    update_order_status,
    get_order_detail
)

# =====================================================
# PAY_01 – TẠO ORDER + PAYMENT THÀNH CÔNG
# =====================================================
@patch("routes.order.get_connection")
def test_payment_created_success(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    # fetchone:
    # 1️⃣ order_id
    # 2️⃣ stock đủ
    mock_cursor.fetchone.side_effect = [
        [1],      # order_id
        (10,)     # stock = 10
    ]

    payload = {
        "user_id": 1,
        "cart_items": [
            {"product_id": 1, "price": 100, "quantity": 2}
        ],
        "payment_method": "cod"
    }

    with app.test_request_context(
        "/api/orders/create",
        method="POST",
        json=payload
    ):
        response, status = create_order()

    assert status == 201
    assert response.json["order_id"] == 1


# =====================================================
# PAY_02 – FAIL: KHÔNG ĐỦ STOCK
# =====================================================
@patch("routes.order.get_connection")
def test_payment_fail_not_enough_stock(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchone.side_effect = [
        [1],     # order_id
        (1,)     # stock < quantity
    ]

    payload = {
        "user_id": 1,
        "cart_items": [
            {"product_id": 1, "price": 100, "quantity": 2}
        ]
    }

    with app.test_request_context(
        "/api/orders/create",
        method="POST",
        json=payload
    ):
        response, status = create_order()

    assert status == 400
    assert "không đủ" in response.json["error"].lower()


# =====================================================
# PAY_03 – FAIL: THIẾU DỮ LIỆU
# =====================================================
def test_payment_fail_missing_data():
    payload = {
        "cart_items": []
    }

    with app.test_request_context(
        "/api/orders/create",
        method="POST",
        json=payload
    ):
        response, status = create_order()

    assert status == 400


# =====================================================
# PAY_04 – ADMIN UPDATE PAYMENT STATUS
# =====================================================
@patch("routes.order.get_connection")
def test_update_payment_status_success(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    payload = {
        "payment_status": "Đã thanh toán"
    }

    with app.test_request_context(
        "/api/orders/update-status/1",
        method="PUT",
        json=payload
    ):
        response, status = update_order_status(1)

    assert status == 200
    assert response.json["new_payment_status"] == "Đã thanh toán"


# =====================================================
# PAY_05 – LẤY CHI TIẾT ORDER + PAYMENT
# =====================================================
@patch("routes.order.get_connection")
def test_get_order_detail_success(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchone.return_value = {
        "order_id": 1,
        "user_id": 1,
        "order_date": MagicMock(strftime=lambda x: "2025-01-01 10:00:00"),
        "total_amount": 200,
        "status": "Chờ xác nhận",
        "payment_method": "cod",
        "payment_status": "Chờ xác nhận",
        "payment_amount": 200
    }

    mock_cursor.fetchall.return_value = []

    with app.test_request_context(
        "/api/orders/1",
        method="GET"
    ):
        response, status = get_order_detail(1)

    assert status == 200
    assert response.json["order_id"] == 1
