import pytest
from unittest.mock import MagicMock, patch


@pytest.fixture(autouse=True)
def mock_db():

    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_conn.cursor.return_value = mock_cursor

    executed_queries = []

    def execute_side_effect(query, *args, **kwargs):
        executed_queries.append(query)

    mock_cursor.execute.side_effect = execute_side_effect

    def fetchone_side_effect():

        if not executed_queries:
            return {}

        last_query = executed_queries[-1]

        if "FROM product" in last_query:
            return {
                "product_id": 1,
                "name": "Test Product",
                "price": 100000,
                "sale_price": 80000,
                "stock": 10,
            }

        return {}

    mock_cursor.fetchone.side_effect = fetchone_side_effect

    mock_cursor.fetchall.return_value = [
        {
            "product_id": 1,
            "name": "Test Product",
            "price": 100000,
            "sale_price": 80000,
            "stock": 10,
        }
    ]

    with patch("db.get_connection", return_value=mock_conn):
        yield mock_cursor