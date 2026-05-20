# conftest.py
# Pytest tự động load file này trước khi chạy test.
# Dùng để set env vars giả lập và tránh import lỗi khi không có DB/API thật.

import os
import pytest

# --- Giả lập env vars trước khi import bất kỳ module nào ---
os.environ.setdefault("GEMINI_API_KEY", "fake-gemini-key")
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_NAME", "skywind")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "12345")