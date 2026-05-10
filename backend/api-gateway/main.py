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
