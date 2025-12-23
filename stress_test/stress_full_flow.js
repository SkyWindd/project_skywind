import http from "k6/http";
import { check, sleep } from "k6";

/* =====================================================
   CONFIG
   ===================================================== */

// Số user tối đa (có thể truyền khi chạy)
const MAX_VUS = __ENV.MAX_VUS ? parseInt(__ENV.MAX_VUS) : 50;

// Thời gian mỗi stage
const STEP_TIME = "20s";

// Backend
const BASE_URL = "http://localhost:5000";

// Tài khoản test
const TEST_EMAIL = "3122411074@gmail.com";
const TEST_PASSWORD = "123456";

/* =====================================================
   OPTIONS – STRESS TEST
   ===================================================== */
export let options = {
  stages: [
    { duration: STEP_TIME, target: Math.floor(MAX_VUS * 0.2) },
    { duration: STEP_TIME, target: Math.floor(MAX_VUS * 0.4) },
    { duration: STEP_TIME, target: Math.floor(MAX_VUS * 0.7) },
    { duration: STEP_TIME, target: MAX_VUS },
    { duration: STEP_TIME, target: 0 },
  ],
};

/* =====================================================
   MAIN FLOW
   ===================================================== */
export default function () {

  /* ---------- STEP 1: HOME ---------- */
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    "HOME | OK": (r) => r.status === 200,
  });

  sleep(0.5);

  /* ---------- STEP 2: LOGIN ---------- */
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginRes, {
    "LOGIN | handled": (r) => r.status < 500,
  });

  // Nếu login lỗi server → dừng iteration
  if (loginRes.status >= 500) {
    return;
  }

  const token = loginRes.json("access_token") || "";

  const authHeaders = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  sleep(0.5);

  /* ---------- STEP 3: PRODUCTS ---------- */
  const productRes = http.get(
    `${BASE_URL}/api/products`,
    authHeaders
  );

  check(productRes, {
    "PRODUCTS | handled": (r) => r.status < 500,
  });

  sleep(0.5);

  /* ---------- STEP 4: ADD TO CART ---------- */
  const cartRes = http.post(
    `${BASE_URL}/api/cart/add`,
    JSON.stringify({
      product_id: 1,
      quantity: 1,
    }),
    authHeaders
  );

  // ✅ Stress test: chỉ coi 5xx là lỗi
  check(cartRes, {
    "CART | handled": (r) => r.status < 500,
  });

  sleep(0.5);

  /* ---------- STEP 5: CREATE ORDER ---------- */
  const orderRes = http.post(
    `${BASE_URL}/api/orders/create`,
    JSON.stringify({
      cart_items: [
        { product_id: 1, quantity: 1, price: 100000 },
      ],
      payment_method: "cod",
    }),
    authHeaders
  );

  check(orderRes, {
    "ORDER | handled": (r) => r.status < 500,
  });

  sleep(1);
}
