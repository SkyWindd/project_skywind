/* eslint-disable no-unused-vars */
// src/api/axiosClient.js
// Axios client chung cho toàn bộ project
// - gắn access token tự động (lấy từ localStorage.authData.accessToken)
// - khi nhận 401 => gọi refresh token (/auth/refresh-token) và retry request
// - queue các request chờ refresh để tránh race condition
//
// Backend cần endpoint:
// POST /auth/refresh-token
// body: { refreshToken: "..." }
// response: { success: true, accessToken: "newAccessToken" }
// (theo spec FE đã thống nhất)
//
// NOTE: file này không phụ thuộc vào AuthContext (tránh vòng lặp import)
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import productApi from "@/api/productApi";
import ProductCard from "@/components/productcard";

const BASE_URL = "http://127.0.0.1:5000/api"; // ✅ dùng 127.0.0.1 thay vì localhost


const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ---------- Helper: get authData from localStorage ----------
function getAuthData() {
  try {
    const raw = localStorage.getItem("authData");
    if (!raw) return null;
    return JSON.parse(raw);
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return null;
  }
}

// ---------- Attach access token if exists ----------
axiosClient.interceptors.request.use((config) => {
  const auth = getAuthData();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// ---------- Refresh token logic ----------
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

// create a plain axios instance for refresh request (no interceptors)
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosClient.interceptors.response.use(
  (response) => response, // successful response: pass through
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401, just forward error message
    if (!error.response) {
      // network error
      toast.error("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
      return Promise.reject(error);
    }

    // If response is 401 and request has not been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      const auth = getAuthData();
      const refreshToken = auth?.refreshToken;

      // if no refresh token -> force logout on FE (AuthContext should handle)
      if (!refreshToken) {
        // Optionally show toast
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue the request until refresh completes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh endpoint
        const res = await refreshClient.post("/auth/refresh-token", {
          refreshToken,
        });

        // Expect backend returns { success: true, accessToken: "..." }
        if (res?.data?.accessToken || res?.accessToken) {
          // support both axios "data" extracted or not depending on instance
          const newAccessToken = res.data?.accessToken || res.accessToken || res?.accessToken;

          // Update localStorage authData.accessToken (preserve other authData fields)
          const current = getAuthData();
          const updated = { ...(current || {}), accessToken: newAccessToken };
          localStorage.setItem("authData", JSON.stringify(updated));

          // process queued requests
          processQueue(null, newAccessToken);

          // set header and retry original request
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          return axiosClient(originalRequest);
        } else {
          // refresh failed
          processQueue(new Error("Refresh token failed"), null);
          toast.error("Không thể gia hạn phiên. Vui lòng đăng nhập lại.");
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

    // Other errors
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra. Vui lòng thử lại.";
    // optional: show toast for unexpected errors
    // toast.error(msg);
    return Promise.reject(error);
  }
);

export default axiosClient;

