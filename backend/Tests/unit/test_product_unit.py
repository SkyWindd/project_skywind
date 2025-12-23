from routes.product import safe_date, generate_slug, ensure_unique_slug
from datetime import date

def test_safe_date_string():
    d = safe_date("2025-01-01")
    assert d == date(2025, 1, 1)

def test_safe_date_invalid():
    assert safe_date("abc") is None

def test_generate_slug_vietnamese():
    slug = generate_slug("Laptop Dell Chính Hãng")
    assert slug == "laptop-dell-chinh-hang"

def test_ensure_unique_slug():
    existing = {"laptop-dell", "laptop-dell-1"}
    new_slug = ensure_unique_slug("laptop-dell", existing)
    assert new_slug == "laptop-dell-2"
