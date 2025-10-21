import unicodedata, re

def clean_filename(text):
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("utf-8")
    text = re.sub(r"[^a-zA-Z0-9._-]", "_", text)
    return text.lower()

def split_if_needed(value):
    if not value:
        return []
    if "," in value:
        return [v.strip() for v in value.split(",")]
    return [value]
