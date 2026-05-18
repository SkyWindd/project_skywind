import pytest
from unittest.mock import MagicMock, patch


@pytest.fixture(autouse=True)
def mock_db():

    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_conn.cursor.return_value = mock_cursor

    mock_cursor.fetchone.return_value = {
        "payment_id": 1,
        "order_id": 1,
        "amount": 500000,
        "status": "paid"
    }

    mock_cursor.fetchall.return_value = []

    with patch("db.get_connection", return_value=mock_conn):
        yield mock_cursor