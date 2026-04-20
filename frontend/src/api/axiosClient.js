// src/api/axiosClient.js
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "http://127.0.0.1:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ============================
// 🔹 Helper: Lấy authData từ localStorage
// ============================
function getAuthData() {
  try {
    const raw = localStorage.getItem("authData");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ============================
// 🔹 Gắn Access Token vào Header
// ============================
axiosClient.interceptors.request.use(
  (config) => {
    const auth = getAuthData();
    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// 🔹 Refresh Token Logic
// ============================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Axios riêng cho refresh (tránh loop interceptor)
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// 🔹 Response Interceptor (FIX CHÍNH)
// ============================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ============================
    // ❌ LỖI MẠNG / SERVER DOWN
    // ============================
    if (!error.response) {
      toast.error("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ============================
    // 🔁 401 → REFRESH TOKEN
    // ============================
    if (status === 401 && !originalRequest._retry) {
      const auth = getAuthData();
      const refreshToken = auth?.refreshToken;

      if (!refreshToken) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("authData");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshClient.post("/auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh token thất bại");
        }

        // Update localStorage
        const updatedAuth = {
          ...auth,
          accessToken: newAccessToken,
        };
        localStorage.setItem("authData", JSON.stringify(updatedAuth));

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          "Bearer " + newAccessToken;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("authData");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ============================
    // 🧱 CÁC LỖI NGHIỆP VỤ (400, 403, 404…)
    // ============================
    const message =
      data?.message ||
      "Có lỗi xảy ra. Vui lòng thử lại.";

    // 🔥 ĐÂY LÀ DÒNG QUAN TRỌNG BỊ THIẾU TRƯỚC ĐÓ
    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosClient;
