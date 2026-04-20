from flask import Blueprint, jsonify, send_from_directory, current_app
from db import get_connection
from .helpers import clean_filename
import os

upload_bp = Blueprint("upload", __name__)

# 🖼️ Route phục vụ ảnh - FIX lỗi 404
@upload_bp.route("/uploads/<path:filename>")
def serve_image(filename):
    try:
        # Lấy thư mục upload chính
        upload_folder = current_app.config.get("UPLOAD_FOLDER")
        if not upload_folder:
            return jsonify({"error": "UPLOAD_FOLDER chưa được cấu hình"}), 500

        # Kiểm tra file có tồn tại không
        file_path = os.path.join(upload_folder, filename)
        if not os.path.exists(file_path):
            print(f"⚠️ File không tồn tại: {file_path}")
            return jsonify({"error": f"File not found: {filename}"}), 404

        # Trả file hợp lệ
        return send_from_directory(upload_folder, filename)

    except Exception as e:
        print("❌ Lỗi serve_image:", e)
        return jsonify({"error": str(e)}), 500


# 📦 Import toàn bộ ảnh trong thư mục uploads vào DB
@upload_bp.route("/api/import_images", methods=["POST"])
def import_images():
    base_folder = current_app.config.get("UPLOAD_FOLDER")
    if not base_folder:
        return jsonify({"error": "UPLOAD_FOLDER chưa được cấu hình"}), 500

    try:
        conn = get_connection()
        cur = conn.cursor()
        count = 0

        for root, _, files in os.walk(base_folder):
            for file in files:
                # Chỉ lấy các file hình hợp lệ
                if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
                    new_name = clean_filename(file)

                    old_path = os.path.join(root, file)
                    new_path = os.path.join(root, new_name)

                    # 🔧 Đổi tên file nếu khác nhau (đảm bảo an toàn)
                    if old_path != new_path:
                        try:
                            os.rename(old_path, new_path)
                        except Exception as e:
                            print(f"⚠️ Không thể rename file {file}: {e}")
                            continue

                    # Tạo đường dẫn tương đối
                    relative_path = os.path.relpath(new_path, base_folder).replace("\\", "/")
                    parts = relative_path.split("/")
                    product_name_guess = parts[0] if len(parts) > 0 else None

                    if not product_name_guess:
                        continue

                    # 🔍 Tìm product_id theo tên thư mục
                    cur.execute("SELECT product_id FROM product WHERE name ILIKE %s LIMIT 1;", (f"%{product_name_guess}%",))
                    product = cur.fetchone()
                    if not product:
                        print(f"⚠️ Không tìm thấy sản phẩm cho {product_name_guess}")
                        continue

                    # 🧩 Lưu ảnh vào DB
                    product_id = product[0] if isinstance(product, tuple) else product["product_id"]
                    image_url = f"uploads/{relative_path}"

                    cur.execute("""
                        INSERT INTO image (product_id, name, path)
                        VALUES (%s, %s, %s)
                        ON CONFLICT DO NOTHING;
                    """, (product_id, new_name, image_url))

                    count += 1

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": f"✅ Đã import {count} ảnh vào DB"})

    except Exception as e:
        print("❌ import_images error:", e)
        return jsonify({"error": str(e)}), 500
