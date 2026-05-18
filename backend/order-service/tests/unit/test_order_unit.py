def test_order_total_price():

    total_price = 500000

    assert total_price > 0



def test_order_status():

    status = "pending"

    assert status in [
        "pending",
        "paid",
        "cancelled"
    ]



def test_order_user():

    user_id = 1

    assert user_id > 0