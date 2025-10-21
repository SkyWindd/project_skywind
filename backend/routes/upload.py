from flask import Blueprint, jsonify, send_from_directory, current_app
from db import get_connection
from utils.helpers import clean_filename
import os

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

@upload_bp.route("/api/import_images", methods=["POST"])
def import_images():
    base_folder = current_app.config["UPLOAD_FOLDER"]
    try:
        conn = get_connection()
        cur = conn.cursor()
        count = 0
        for root, _, files in os.walk(base_folder):
            for file in files:
                if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
                    new_name = clean_filename(file)
                    old_path = os.path.join(root, file)
                    new_path = os.path.join(root, new_name)
                    if old_path != new_path:
                        os.rename(old_path, new_path)
                    relative_path = os.path.relpath(new_path, base_folder).replace("\\", "/")
                    parts = relative_path.split("/")
                    product_name_guess = parts[0]
                    cur.execute("SELECT product_id FROM product_new WHERE name ILIKE %s LIMIT 1;", (f"%{product_name_guess}%",))
                    product = cur.fetchone()
                    if not product: continue
                    product_id = product["product_id"]
                    image_url = f"uploads/{relative_path}"
                    cur.execute(
                        "INSERT INTO image (product_id, name, path) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;",
                        (product_id, new_name, image_url)
                    )
                    count += 1
        conn.commit(); cur.close(); conn.close()
        return jsonify({"message": f"Đã import {count} ảnh vào DB ✅"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
