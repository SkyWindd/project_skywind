from fastapi import FastAPI, Request
import httpx

app = FastAPI()

SERVICES = {
    "users": "http://user-service:5003",
    "products": "http://product-service:5001",
    "orders": "http://order-service:5000",
    "inventory": "http://inventory-service:5002",
}

@app.api_route("/{service}/{path:path}", methods=["GET","POST","PUT","DELETE"])
async def gateway(service: str, path: str, request: Request):
    if service not in SERVICES:
        return {"error": "Unknown service"}

    url = f"{SERVICES[service]}/{path}"
    async with httpx.AsyncClient() as client:
        response = await client.request(
            request.method,
            url,
            params=request.query_params,
            content=await request.body()
        )
    return response.json()