// src/context/AuthContext.jsx
// AuthContext: quản lý auth state + login/register/logout + auto load từ localStorage
// Lưu toàn bộ response (authData) vào localStorage theo key "authData"
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import axiosClient from "../api/axiosClient"; // optional if want to call protected endpoints
import { toast } from "sonner";

/**
 * authData structure (FE lưu nguyên response backend)
 * {
 *   success: true,
 *   message: "Đăng nhập thành công",
 *   accessToken: "xxx",
 *   refreshToken: "yyy",
 *   user: { id, fullName, email, role... }
 * }
 */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null); // stores full object from backend
  const [loading, setLoading] = useState(false); // loading during login/register
  const [initializing, setInitializing] = useState(true); // loading on app start
  const navigate = useNavigate();

  // Load authData from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem("authData");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAuthData(parsed);
      } catch (err) {
        console.error("Error parsing authData from localStorage", err);
        localStorage.removeItem("authData");
      }
    }
    setInitializing(false);
  }, []);

  // Helper: save authData to localStorage and state
  const persistAuth = (data) => {
    setAuthData(data);
    localStorage.setItem("authData", JSON.stringify(data));
  };

  // Login: call authApi.login(payload)
  // payload = { email, password }
  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.login(payload);
      // axiosClient interceptor returns axios response (not only data),
      // but in our axiosClient we returned response; if axios interceptor returns response.data we might get data directly
      // To be safe, if res.data exists use it, else res
      const data = res?.data || res;

      if (data?.success) {
        // We expect backend returns accessToken & refreshToken & user
        persistAuth(data);
        toast.success(data.message || "Đăng nhập thành công");
        // redirect to home
        navigate("/", { replace: true });
        setLoading(false);
        return { ok: true, data };
      } else {
        // API returned success: false
        toast.error(data?.message || "Đăng nhập thất bại");
        setLoading(false);
        return { ok: false, message: data?.message };
      }
    } catch (err) {
      // err may be string (from axios interceptor) or Error
      const message = err?.message || err || "Lỗi khi gọi API đăng nhập";
      toast.error(message);
      setLoading(false);
      return { ok: false, message };
    }
  };

  // Register: call authApi.register(payload)
  // payload = { fullName, email, password }
  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.register(payload);
      const data = res?.data || res;

      if (data?.success) {
        toast.success(data.message || "Đăng ký thành công");
        setLoading(false);
        // You may want to auto-login after register:
        // return await login({ email: payload.email, password: payload.password });
        return { ok: true, data };
      } else {
        toast.error(data?.message || "Đăng ký thất bại");
        setLoading(false);
        return { ok: false, message: data?.message };
      }
    } catch (err) {
      const message = err?.message || err || "Lỗi khi gọi API đăng ký";
      toast.error(message);
      setLoading(false);
      return { ok: false, message };
    }
  };

  // Logout: clear storage and context; redirect to /login
  const logout = (redirect = true) => {
    setAuthData(null);
    localStorage.removeItem("authData");
    toast.success("Đăng xuất thành công");
    if (redirect) {
      navigate("/login", { replace: true });
    }
  };

  // Optional helper to get user
  const user = authData?.user || null;
  const isAuthenticated = !!authData?.accessToken;

  // Context value
  const value = {
    authData,
    user,
    isAuthenticated,
    loading,
    initializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook tiện dụng
export const useAuth = () => {
  return useContext(AuthContext);
};
