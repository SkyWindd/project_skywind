"""
Test suite cho ai-service (Skywind)
Chạy: pytest tests/ -v
"""

import pytest
from unittest.mock import patch, MagicMock


# ============================================================
# FIXTURES
# ============================================================

@pytest.fixture
def mock_products():
    return [
        {
            "product_id": 1,
            "name": "Laptop Dell XPS 13",
            "price": 25000000.0,
            "slug": "laptop-dell-xps-13",
            "cpu": "Intel Core i7-1260P",
            "ram": "16GB",
            "ssd": "512GB",
            "vga": "Intel Iris Xe",
            "brand": "Dell",
            "images": ["/images/dell-xps-13.jpg"],
            "similarity": 0.92,
        },
        {
            "product_id": 2,
            "name": "Laptop Asus VivoBook 15",
            "price": 15000000.0,
            "slug": "laptop-asus-vivobook-15",
            "cpu": "AMD Ryzen 5 5500U",
            "ram": "8GB",
            "ssd": "256GB",
            "vga": "AMD Radeon",
            "brand": "Asus",
            "images": [],
            "similarity": 0.75,
        },
    ]


@pytest.fixture
def flask_client():
    """Flask test client với mock search_products và get_reply."""
    with patch("rag.search_products"), patch("llm.get_reply"):
        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            yield client


# ============================================================
# UNIT TEST — llm.py
# ============================================================

class TestLLM:
    @patch("llm.genai.Client")
    def test_ask_gemini_returns_text(self, mock_client_cls):
        """ask_gemini trả về text từ Gemini."""
        mock_response = MagicMock()
        mock_response.text = "Dạ, em tư vấn laptop Dell XPS 13 ạ!"
        mock_client_cls.return_value.models.generate_content.return_value = mock_response

        from llm import ask_gemini
        result = ask_gemini("laptop cho sinh viên", "- Dell XPS 13 | Dell | ...")
        assert result == "Dạ, em tư vấn laptop Dell XPS 13 ạ!"

    @patch("llm.genai.Client")
    def test_ask_gemini_called_with_correct_model(self, mock_client_cls):
        """ask_gemini phải gọi đúng model gemini-2.5-flash."""
        mock_response = MagicMock()
        mock_response.text = "OK"
        mock_instance = mock_client_cls.return_value
        mock_instance.models.generate_content.return_value = mock_response

        from llm import ask_gemini
        ask_gemini("test", "context")

        call_kwargs = mock_instance.models.generate_content.call_args
        assert call_kwargs.kwargs.get("model") == "gemini-2.5-flash" or \
               call_kwargs.args[0] == "gemini-2.5-flash" or \
               "gemini-2.5-flash" in str(call_kwargs)

    @patch("llm.genai.Client")
    def test_get_reply_delegates_to_gemini(self, mock_client_cls):
        """get_reply phải gọi ask_gemini (không dùng OpenAI)."""
        mock_response = MagicMock()
        mock_response.text = "Phản hồi từ Gemini"
        mock_client_cls.return_value.models.generate_content.return_value = mock_response

        from llm import get_reply
        result = get_reply("tư vấn laptop", "context")
        assert result == "Phản hồi từ Gemini"

    @patch("llm.genai.Client")
    def test_ask_gemini_includes_system_prompt(self, mock_client_cls):
        """Prompt gửi đi phải chứa SYSTEM_PROMPT."""
        mock_response = MagicMock()
        mock_response.text = "OK"
        mock_instance = mock_client_cls.return_value
        mock_instance.models.generate_content.return_value = mock_response

        from llm import ask_gemini, SYSTEM_PROMPT
        ask_gemini("câu hỏi", "context")

        call_args = mock_instance.models.generate_content.call_args
        prompt_sent = str(call_args)
        assert "Bi" in prompt_sent or SYSTEM_PROMPT[:20] in prompt_sent

    @patch("llm.genai.Client")
    def test_ask_gemini_raises_on_api_error(self, mock_client_cls):
        """Nếu Gemini lỗi, exception phải được raise lên."""
        mock_client_cls.return_value.models.generate_content.side_effect = Exception("API error")

        from llm import ask_gemini
        with pytest.raises(Exception, match="API error"):
            ask_gemini("test", "context")


# ============================================================
# UNIT TEST — rag.py
# ============================================================

class TestRAG:
    @patch("rag.genai.Client")
    def test_embed_query_returns_list(self, mock_client_cls):
        """embed_query phải trả về list of float."""
        mock_embedding = MagicMock()
        mock_embedding.values = [0.1, 0.2, 0.3]
        mock_client_cls.return_value.models.embed_content.return_value.embeddings = [mock_embedding]

        from rag import embed_query
        result = embed_query("laptop gaming")
        assert isinstance(result, list)
        assert result == [0.1, 0.2, 0.3]

    @patch("rag.get_conn")
    @patch("rag.register_vector")
    @patch("rag.embed_query")
    def test_search_products_vector_returns_list(self, mock_embed, mock_register, mock_conn, mock_products):
        """search_products_vector phải trả về list dict đúng cấu trúc."""
        mock_embed.return_value = [0.1] * 768

        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [
            (1, "Dell XPS 13", 25000000, "dell-xps-13",
             "i7", "16GB", "512GB", "Intel Iris", "Dell", "/img/dell.jpg", 0.92)
        ]
        mock_conn.return_value.__enter__ = lambda s: s
        mock_conn.return_value.cursor.return_value = mock_cursor
        mock_conn.return_value.close = MagicMock()

        from rag import search_products_vector
        results = search_products_vector("laptop dell")

        assert isinstance(results, list)
        assert results[0]["name"] == "Dell XPS 13"
        assert results[0]["similarity"] == 0.92
        assert "brand" in results[0]
        assert "images" in results[0]

    @patch("rag.get_conn")
    def test_search_products_fulltext_returns_list(self, mock_conn):
        """search_products_fulltext phải trả về list dict."""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [
            (2, "Asus VivoBook", 15000000, "asus-vivobook",
             "Ryzen 5", "8GB", "256GB", "AMD Radeon", "Asus", None)
        ]
        mock_conn.return_value.cursor.return_value = mock_cursor
        mock_conn.return_value.close = MagicMock()

        from rag import search_products_fulltext
        results = search_products_fulltext("asus")

        assert len(results) == 1
        assert results[0]["brand"] == "Asus"
        assert results[0]["images"] == []       # path=None → images=[]
        assert results[0]["similarity"] is None  # fulltext không có similarity

    @patch("rag.search_products_fulltext")
    @patch("rag.search_products_vector")
    def test_search_products_short_query_uses_fulltext_first(
        self, mock_vector, mock_fulltext, mock_products
    ):
        """Query ngắn (≤3 từ) phải thử fulltext trước."""
        mock_fulltext.return_value = mock_products

        from rag import search_products
        search_products("dell i7")

        mock_fulltext.assert_called_once()
        mock_vector.assert_not_called()

    @patch("rag.search_products_fulltext")
    @patch("rag.search_products_vector")
    def test_search_products_long_query_uses_vector(
        self, mock_vector, mock_fulltext, mock_products
    ):
        """Query dài (>3 từ) phải dùng vector search."""
        mock_vector.return_value = mock_products

        from rag import search_products
        search_products("laptop gaming cho sinh viên giá rẻ")

        mock_vector.assert_called_once()

    @patch("rag.search_products_fulltext")
    @patch("rag.search_products_vector")
    def test_search_products_fallback_when_vector_fails(
        self, mock_vector, mock_fulltext, mock_products
    ):
        """Nếu vector search lỗi, phải fallback về fulltext."""
        mock_vector.side_effect = Exception("pgvector connection error")
        mock_fulltext.return_value = mock_products

        from rag import search_products
        results = search_products("laptop gaming cho sinh viên")

        mock_fulltext.assert_called_once()
        assert results == mock_products

    @patch("rag.search_products_fulltext")
    @patch("rag.search_products_vector")
    def test_search_products_fallback_when_vector_empty(
        self, mock_vector, mock_fulltext, mock_products
    ):
        """Nếu vector trả về rỗng, thử fulltext."""
        mock_vector.return_value = []
        mock_fulltext.return_value = mock_products

        from rag import search_products
        results = search_products("laptop gaming mạnh nhất hiện nay")

        assert results == mock_products


# ============================================================
# UNIT TEST — db.py
# ============================================================

class TestDB:
    @patch("db.psycopg2.connect")
    def test_get_conn_uses_env_variables(self, mock_connect):
        """get_conn phải dùng đúng env vars."""
        import os
        os.environ["DB_HOST"] = "test-host"
        os.environ["DB_NAME"] = "test-db"
        os.environ["DB_USER"] = "test-user"
        os.environ["DB_PASSWORD"] = "test-pass"

        from db import get_conn
        get_conn()

        mock_connect.assert_called_once_with(
            host="test-host",
            dbname="test-db",
            user="test-user",
            password="test-pass",
            port=5432,
        )

    @patch("db.psycopg2.connect")
    def test_get_conn_default_values(self, mock_connect):
        """get_conn phải có default value khi không có env."""
        import os
        for key in ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"]:
            os.environ.pop(key, None)

        from db import get_conn
        get_conn()

        call_kwargs = mock_connect.call_args.kwargs
        assert call_kwargs["host"] == "postgres"
        assert call_kwargs["dbname"] == "skywind"
        assert call_kwargs["user"] == "postgres"


# ============================================================
# INTEGRATION TEST — app.py (Flask API)
# ============================================================

class TestSearchEndpoint:
    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_returns_200(self, mock_search, mock_reply, mock_products):
        """POST /api/search phải trả về 200."""
        mock_search.return_value = mock_products
        mock_reply.return_value = "Dạ em tư vấn Dell XPS 13 ạ!"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post(
                "/api/search",
                json={"message": "laptop cho sinh viên"},
                content_type="application/json",
            )
        assert resp.status_code == 200

    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_response_has_required_fields(self, mock_search, mock_reply, mock_products):
        """Response phải có field 'context' và 'products'."""
        mock_search.return_value = mock_products
        mock_reply.return_value = "Tư vấn từ Bi"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post("/api/search", json={"message": "dell"})
            data = resp.get_json()

        assert "context" in data
        assert "products" in data

    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_context_contains_product_info(self, mock_search, mock_reply, mock_products):
        """Context phải chứa thông tin sản phẩm (tên, giá...)."""
        mock_search.return_value = mock_products
        mock_reply.return_value = "OK"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post("/api/search", json={"message": "laptop dell"})
            data = resp.get_json()

        assert "Dell XPS 13" in data["context"]
        assert "25,000,000" in data["context"] or "25000000" in data["context"]

    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_no_products_returns_fallback_context(self, mock_search, mock_reply):
        """Khi không tìm thấy sản phẩm, context phải có thông báo fallback."""
        mock_search.return_value = []
        mock_reply.return_value = "Không tìm thấy"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post("/api/search", json={"message": "laptop xyz abc"})
            data = resp.get_json()

        assert "Không tìm thấy" in data["context"]

    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_empty_message(self, mock_search, mock_reply):
        """Message rỗng phải xử lý được, không crash."""
        mock_search.return_value = []
        mock_reply.return_value = "Bạn cần tư vấn gì ạ?"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post("/api/search", json={"message": ""})

        assert resp.status_code == 200

    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_missing_message_key(self, mock_search, mock_reply):
        """Thiếu key 'message' phải xử lý được (default empty string)."""
        mock_search.return_value = []
        mock_reply.return_value = "OK"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post("/api/search", json={})

        assert resp.status_code == 200

    def test_search_wrong_method_returns_405(self):
        """GET /api/search phải trả về 405 Method Not Allowed."""
        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.get("/api/search")

        assert resp.status_code == 405

    @patch("app.get_reply")
    @patch("app.search_products")
    def test_search_products_list_in_response(self, mock_search, mock_reply, mock_products):
        """Response products phải là list với đủ fields."""
        mock_search.return_value = mock_products
        mock_reply.return_value = "OK"

        from app import app
        app.config["TESTING"] = True
        with app.test_client() as client:
            resp = client.post("/api/search", json={"message": "dell"})
            data = resp.get_json()

        assert isinstance(data["products"], list)
        assert len(data["products"]) == 2
        assert data["products"][0]["name"] == "Laptop Dell XPS 13"