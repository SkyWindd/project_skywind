import pytest
from unittest.mock import patch, MagicMock
from server import app
from routes.order import (
    create_order,
    get_order_detail,
    update_order_status,
    get_orders_by_user,
    get_all_orders
)

# =================================================
# ORDER_01 – CREATE ORDER SUCCESS
# =================================================
@patch("routes.order.get_connection")
def test_create_order_success(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    # fetchone() lần lượt:
    # 1️⃣ order_id
    # 2️⃣ stock
    mock_cursor.fetchone.side_effect = [
        [1],     # order_id
        (10,)    # stock đủ
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


# =================================================
# ORDER_02 – CREATE ORDER FAIL (NOT ENOUGH STOCK)
# =================================================
@patch("routes.order.get_connection")
def test_create_order_not_enough_stock(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchone.side_effect = [
        [1],    # order_id
        (1,)    # stock < quantity
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


# =================================================
# ORDER_03 – GET ORDER DETAIL SUCCESS
# =================================================
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


# =================================================
# ORDER_04 – UPDATE ORDER STATUS
# =================================================
@patch("routes.order.get_connection")
def test_update_order_status_success(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    payload = {
        "order_status": "Đã giao",
        "payment_status": "Đã thanh toán"
    }

    with app.test_request_context(
        "/api/orders/update-status/1",
        method="PUT",
        json=payload
    ):
        response, status = update_order_status(1)

    assert status == 200
    assert response.json["new_status"] == "Đã giao"
    assert response.json["new_payment_status"] == "Đã thanh toán"


# =================================================
# ORDER_05 – GET ORDERS BY USER
# =================================================
@patch("routes.order.get_connection")
def test_get_orders_by_user(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchall.side_effect = [
        [
            {
                "order_id": 1,
                "order_date": MagicMock(strftime=lambda x: "2025-01-01 10:00:00"),
                "total_amount": 200,
                "status": "Chờ xác nhận",
                "payment_method": "cod",
                "payment_status": "Chờ xác nhận",
                "payment_amount": 200
            }
        ],
        []
    ]

    with app.test_request_context(
        "/api/orders/user/1",
        method="GET"
    ):
        response, status = get_orders_by_user(1)

    assert status == 200
    assert len(response.json) == 1


# =================================================
# ORDER_06 – GET ALL ORDERS (ADMIN)
# =================================================
@patch("routes.order.get_connection")
def test_get_all_orders(mock_get_conn):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_get_conn.return_value = mock_conn
    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchall.return_value = [
        {
            "order_id": 1,
            "user_id": 1,
            "order_date": "2025-01-01",
            "total_amount": 200,
            "status": "Chờ xác nhận"
        }
    ]

    with app.test_request_context(
        "/api/orders",
        method="GET"
    ):
        response, status = get_all_orders()

    assert status == 200
    assert len(response.json) == 1
