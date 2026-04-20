# 🐍 Dùng Python chính thức, ổn định và nhẹ
FROM python:3.11-slim

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy requirements trước để tận dụng layer cache của Docker
COPY requirements.txt .

# ✅ Cập nhật pip + setuptools để tránh lỗi cài đặt
RUN python -m pip install --upgrade pip setuptools wheel

# ✅ Cài đặt dependencies backend
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code backend
COPY . .

# ✅ Cài thêm công cụ reload tự động (nếu đang dev)
RUN pip install watchdog

# ✅ Biến môi trường Flask
ENV FLASK_APP=server.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Mở port Flask
EXPOSE 5000

# ✅ Chạy Flask (tự reload code khi dev)
CMD ["python", "app.py"]
