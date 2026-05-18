import pytest


def test_discount_calculation():

    original_price = 200000
    sale_price = 150000

    discount_percent = int(
        (original_price - sale_price)
        / original_price * 100
    )

    assert discount_percent == 25



def test_final_price():

    original_price = 100000
    discount_percent = 20

    final_price = original_price - (
        original_price * discount_percent / 100
    )

    assert final_price == 80000



def test_product_stock():

    stock = 10

    assert stock > 0



def test_product_name_not_empty():

    product_name = "Gaming Mouse"

    assert product_name != ""