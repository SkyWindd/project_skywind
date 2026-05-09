// src/api/axiosClient.js

import axios from "axios";
import { toast } from "sonner";

// ============================
// 🔹 BASE URL
// ============================
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// ============================
// 🔹 Axios chính
// ============================
const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// 🔹 Axios refresh riêng
// ============================
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// 🔹 Helper lấy authData
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
// 🔹 Refresh Queue
// ============================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ============================
// 🔹 RESPONSE INTERCEPTOR
// ============================
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ============================
    // ❌ Không có response
    // ============================
    if (!error.response) {
      toast.error("Không thể kết nối đến server");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ============================
    // 🔥 KHÔNG REFRESH CHO LOGIN
    // ============================
    const isLoginRequest =
      originalRequest.url?.includes("/api/auth/login");

    // ============================
    // 🔁 REFRESH TOKEN
    // ============================
    if (
      status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      const auth = getAuthData();
      const refreshToken = auth?.refreshToken;

      // ❌ Không có refresh token
      if (!refreshToken) {
        localStorage.removeItem("authData");

        toast.error(
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
        );

        return Promise.reject(error);
      }

      // ============================
      // 🔁 Nếu đang refresh
      // ============================
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization =
              "Bearer " + token;

            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ============================
        // 🔥 GỌI REFRESH TOKEN ĐÚNG URL
        // ============================
        const res = await refreshClient.post(
          "/api/auth/refresh-token",
          {
            refreshToken,
          }
        );

        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh token thất bại");
        }

        // ============================
        // 🔹 Update localStorage
        // ============================
        const updatedAuth = {
          ...auth,
          accessToken: newAccessToken,
        };

        localStorage.setItem(
          "authData",
          JSON.stringify(updatedAuth)
        );

        processQueue(null, newAccessToken);

        // ============================
        // 🔹 Gắn token mới
        // ============================
        originalRequest.headers.Authorization =
          "Bearer " + newAccessToken;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("authData");

        toast.error(
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
        );

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ============================
    // 🔥 MESSAGE BACKEND
    // ============================
    const message =
      data?.message ||
      data?.error ||
      "Có lỗi xảy ra. Vui lòng thử lại.";

    // ============================
    // 🔥 Không spam toast login
    // ============================
    if (!isLoginRequest) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;