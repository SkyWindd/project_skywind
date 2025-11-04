// src/api/axiosClient.js
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "http://127.0.0.1:5000/api"; // ✅ nên dùng 127.0.0.1 để tránh lỗi CORS ngẫu nhiên

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
axiosClient.interceptors.request.use((config) => {
  const auth = getAuthData();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// ============================
// 🔹 Cơ chế Refresh Token tự động
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

// Dùng axios riêng để tránh vòng lặp interceptor khi refresh
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ Không có response (network lỗi)
    if (!error.response) {
      toast.error("Không thể kết nối đến server. Kiểm tra mạng hoặc backend.");
      return Promise.reject(error);
    }

    // 🔁 Nếu lỗi 401 → cần refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      const auth = getAuthData();
      const refreshToken = auth?.refreshToken;

      if (!refreshToken) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Hàng đợi chờ refresh hoàn tất
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

        const newAccessToken =
          res.data?.accessToken || res.accessToken || null;

        if (newAccessToken) {
          // Cập nhật localStorage
          const current = getAuthData() || {};
          const updated = { ...current, accessToken: newAccessToken };
          localStorage.setItem("authData", JSON.stringify(updated));

          processQueue(null, newAccessToken);

          // Gắn token mới và gửi lại request cũ
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          return axiosClient(originalRequest);
        } else {
          processQueue(new Error("Refresh token thất bại"), null);
          toast.error("Không thể làm mới phiên. Vui lòng đăng nhập lại.");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 🧱 Các lỗi khác
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra. Vui lòng thử lại.";
    // toast.error(msg);
    return Promise.reject(error);
  }
);

export default axiosClient;
