import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Order() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      console.log("⚠️ Không có user trong context");
      return;
    }

    // ✅ Đảm bảo có ID người dùng (vì backend có thể trả user_id thay vì id)
    const userId = user.id || user.user_id;

    if (!userId) {
      console.warn("⚠️ userId bị undefined. Kiểm tra lại dữ liệu user:", user);
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log("📡 Gọi API với userId:", userId);
        # api-gateway/main.py

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import httpx
import time
import os
import asyncio
from collections import defaultdict
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# ============================
# 🔹 CORS
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# 🔹 METRICS
# ============================
Instrumentator().instrument(app).expose(app)

# ============================
# 🔹 SERVICES
# ============================
SERVICES = {
    "auth": os.getenv(
        "AUTH_SERVICE",
        "http://auth-service:5005"
    ),

    "admin": os.getenv(
        "ADMIN_SERVICE",
        "http://admin-service:5006"
    ),

    "users": os.getenv(
        "USER_SERVICE",
        "http://user-service:5003"
    ),

    "products": os.getenv(
        "PRODUCT_SERVICE",
        "http://product-service:5001"
    ),

    "orders": os.getenv(
        "ORDER_SERVICE",
        "http://order-service:5004"
    ),

    "inventory": os.getenv(
        "INVENTORY_SERVICE",
        "http://inventory-service:5002"
    ),

    "payment": os.getenv(
        "PAYMENT_SERVICE",
        "http://payment-service:5008"
    ),
}

# ============================
# 🔹 LOGGING
# ============================
@app.middleware("http")
async def log_requests(request: Request, call_next):

    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    print(
        f"[GATEWAY] "
        f"{request.method} "
        f"{request.url.path} "
        f"Status={response.status_code} "
        f"Time={duration:.3f}s"
    )

    return response

# ============================
# 🔹 VERIFY TOKEN
# ============================
def verify_token(request: Request):

    public_routes = [
        "/",
        "/docs",
        "/openapi.json",
        "/metrics",

        # AUTH
        "/auth/api/auth/login",
        "/auth/api/auth/register",
        "/auth/api/auth/google-login",
        "/auth/api/auth/refresh-token",

        # ADDRESS PUBLIC
        "/users/api/address/provinces",
        "/users/api/address/districts",
        "/users/api/address/wards",
    ]

    # 🔹 Public routes
    for route in public_routes:
        if request.url.path.startswith(route):
            return

    # 🔹 Authorization header
    auth = request.headers.get("Authorization")

    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    token = auth.split(" ")[1]

    # 🔹 Chỉ cần có token
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return

# ============================
# 🔹 RATE LIMIT
# ============================
rate_limit = defaultdict(list)

def check_rate_limit(ip):

    now = time.time()

    window = 60

    rate_limit[ip] = [
        t for t in rate_limit[ip]
        if now - t < window
    ]

    if len(rate_limit[ip]) > 100:
        raise HTTPException(
            status_code=429,
            detail="Too many requests"
        )

    rate_limit[ip].append(now)

# ============================
# 🔹 CIRCUIT BREAKER
# ============================
service_down = {}

def is_service_down(service):

    if service not in service_down:
        return False

    return time.time() - service_down[service] < 10

# ============================
# 🔹 GATEWAY
# ============================
@app.api_route(
    "/{service}/{path:path}",
    methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS"
    ]
)
async def gateway(
    service: str,
    path: str,
    request: Request
):

    # ============================
    # 🔹 PREFLIGHT
    # ============================
    if request.method == "OPTIONS":
        return Response(status_code=200)

    # ============================
    # 🔹 VERIFY TOKEN
    # ============================
    verify_token(request)

    # ============================
    # 🔹 RATE LIMIT
    # ============================
    client_ip = request.client.host

    check_rate_limit(client_ip)

    # ============================
    # 🔹 CHECK SERVICE
    # ============================
    if service not in SERVICES:

        return Response(
            content='{"error":"Unknown service"}',
            status_code=404,
            media_type="application/json"
        )

    # ============================
    # 🔹 CIRCUIT BREAKER
    # ============================
    if is_service_down(service):

        return Response(
            content='{"error":"Service temporarily unavailable"}',
            status_code=503,
            media_type="application/json"
        )

    # ============================
    # 🔹 TARGET URL
    # ============================
    url = f"{SERVICES[service]}/{path}"

    try:

        async with httpx.AsyncClient(
            timeout=30.0
        ) as client:

            response = None

            # ============================
            # 🔹 RETRY 3 LẦN
            # ============================
            for attempt in range(3):

                try:

                    response = await client.request(
                        method=request.method,
                        url=url,

                        headers={
                            k: v
                            for k, v in request.headers.items()
                            if k.lower() != "host"
                        },

                        params=request.query_params,

                        content=await request.body()
                    )

                    break

                except httpx.RequestError:

                    if attempt == 2:
                        raise

                    await asyncio.sleep(0.3)

        # ============================
        # 🔹 RETURN RESPONSE
        # ============================
        return Response(
            content=response.content,

            status_code=response.status_code,

            headers={
                k: v
                for k, v in response.headers.items()
                if k.lower() not in [
                    "content-encoding",
                    "transfer-encoding",
                    "connection"
                ]
            },
        )

    # ============================
    # 🔹 SERVICE DOWN
    # ============================
    except httpx.ConnectError:

        service_down[service] = time.time()

        return Response(
            content='{"error":"Service unavailable"}',
            status_code=503,
            media_type="application/json"
        )

    # ============================
    # 🔹 TIMEOUT
    # ============================
    except httpx.ReadTimeout:

        return Response(
            content='{"error":"Service timeout"}',
            status_code=504,
            media_type="application/json"
        )

    # ============================
    # 🔹 INTERNAL ERROR
    # ============================
    except Exception as e:

        return Response(
            content=f'{{"error":"{str(e)}"}}',
            status_code=500,
            media_type="application/json"
        )

# ============================
# 🔹 ROOT
# ============================
@app.get("/")
async def root():

    return {
        "message": "API Gateway Running",
        "services": list(SERVICES.keys())
    }

        console.log("📦 Dữ liệu đơn hàng trả về:", res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải đơn hàng:", error);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">
          ⚠️ Bạn cần đăng nhập để xem đơn hàng của mình.
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="ml-4 bg-blue-600 text-white"
        >
          Đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📦 Đơn hàng của tôi
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Thông tin đơn hàng */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium">
                  Mã đơn hàng:{" "}
                  <span className="text-blue-600">{order.order_id}</span>
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Hoàn tất"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Ngày đặt */}
              <p className="text-gray-600 text-sm mb-2">
                Ngày đặt:{" "}
                {new Date(order.order_date).toLocaleDateString("vi-VN")}
              </p>

              {/* Danh sách sản phẩm */}
              <div className="border-t pt-3 space-y-2">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>{Number(item.price).toLocaleString()}₫</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có sản phẩm.</p>
                )}
              </div>

              {/* Thanh toán */}
              <div className="border-t mt-3 pt-3 flex justify-between text-sm text-gray-600">
                <span>Phương thức thanh toán:</span>
                <span className="font-medium uppercase">
                  {order.payment?.method === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : order.payment?.method || "Không rõ"}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Trạng thái thanh toán:</span>
                <span className="font-medium">
                  {order.payment?.status || "Chờ xử lý"}
                </span>
              </div>

              {/* Tổng cộng */}
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {Number(order.total_amount).toLocaleString()}₫
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
