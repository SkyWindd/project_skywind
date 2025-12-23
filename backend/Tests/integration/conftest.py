import pytest
from unittest.mock import MagicMock, patch

@pytest.fixture(autouse=True)
def mock_db():
    """
    Patch toàn bộ get_connection để test chạy mà không cần DB thật.
    """
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value = mock_cursor

    # Fake fetchone dựa vào query
    def fetchone_side_effect(*args, **kwargs):
        query = args[0] if args else ""
        if "FROM users" in query or "FROM \"user\"" in query:
            return {"user_id": 1, "email": "test@example.com"}
        elif "FROM product" in query:
            return {"product_id": 1, "slug": "test-product"}
        elif "FROM cart" in query:
            return {"cart_id": 1}
        elif "FROM \"order\"" in query:
            return {"order_id": 1}
        elif "FROM payment" in query:
            return {"payment_id": 1}
        return {}

    mock_cursor.fetchone.side_effect = fetchone_side_effect
    mock_cursor.fetchall.return_value = []

    with patch("db.get_connection", return_value=mock_conn):
        yield mock_cursor
