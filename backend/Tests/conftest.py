# tests/integration/conftest.py
import pytest
from server import create_app  # giả sử bạn có factory
import tempfile
from db import get_connection

@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["BASE_URL"] = "http://localhost:5000"
    app.config["UPLOAD_FOLDER"] = tempfile.mkdtemp()
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db_conn():
    conn = get_connection()
    yield conn
    conn.rollback()  # rollback sau mỗi test
    conn.close()
