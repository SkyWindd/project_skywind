// src/api/axiosClient.js
import axios from "axios";
import { toast } from "sonner";

// 🔥 BASE URL phải là API GATEWAY
const BASE_URL = "http://localhost:8000";

// ============================
// 🔹 Tạo axios instance
// ============================
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ============================
// 🔹 Helper: lấy authData
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
// 🔹 Gắn Access Token
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

// Axios riêng cho refresh (tránh loop)
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// 🔹 Response Interceptor
// ============================
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ Lỗi mạng
    if (!error.response) {
      toast.error("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ============================
    // 🔁 REFRESH TOKEN
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
        // 🔥 gọi qua gateway → auth service
        const res = await refreshClient.post(
          "/auth/api/auth/refresh-token",
          {
            refreshToken,
          }
        );

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
    // 🧱 Lỗi nghiệp vụ
    // ============================
    const message =
      data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosClient;