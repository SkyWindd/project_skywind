from routes.product import generate_slug, safe_date
from datetime import date

def test_generate_slug():
    slug = generate_slug("Laptop Dell Inspiron")
    assert slug == "laptop-dell-inspiron"

def test_safe_date_string():
    d = safe_date("2024-12-01")
    assert isinstance(d, date)

def test_safe_date_invalid():
    assert safe_date("abc") is None
