import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ⭐ Load user từ sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ⭐ Hàm login — FIX CHÍNH
  const login = (userData) => {
    const fixedUser = {
      ...userData,
      id: userData.user_id || userData.id || userData._id || null,
      role: userData.role || "user",
    };
    setUser(fixedUser);
    sessionStorage.setItem("user", JSON.stringify(fixedUser));
  };

  // ⭐ Logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // ⭐ Cập nhật thông tin user   ← THÊM MỚI
  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    sessionStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>  {/* ← thêm updateUser */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);