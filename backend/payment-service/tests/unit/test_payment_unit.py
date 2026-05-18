def test_payment_amount():

    amount = 500000

    assert amount > 0



def test_payment_status():

    status = "paid"

    assert status in [
        "pending",
        "paid",
        "failed"
    ]



def test_payment_order():

    order_id = 1

    assert order_id > 0