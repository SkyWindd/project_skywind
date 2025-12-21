import pytest
from services.order_service import (
    calculate_total_price,
    validate_order_items,
    can_user_create_order
)

# =========================
# TEST TÍNH TỔNG TIỀN
# =========================
def test_calculate_total_price_success():
    items = [
        {"price": 10000, "quantity": 2},
        {"price": 5000, "quantity": 1}
    ]
    assert calculate_total_price(items) == 25000


def test_calculate_total_price_empty():
    assert calculate_total_price([]) == 0


# =========================
# TEST VALIDATE ORDER
# =========================
def test_validate_order_items_valid():
    items = [{"price": 10000, "quantity": 1}]
    assert validate_order_items(items) is True


def test_validate_order_items_invalid_quantity():
    items = [{"price": 10000, "quantity": 0}]
    assert validate_order_items(items) is False


# =========================
# TEST PHÂN QUYỀN ORDER
# =========================
def test_user_can_create_order():
    assert can_user_create_order("user") is True


def test_admin_can_create_order():
    assert can_user_create_order("admin") is True


def test_guest_cannot_create_order():
    assert can_user_create_order("guest") is False
