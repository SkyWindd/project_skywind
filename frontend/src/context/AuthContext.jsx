// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Lấy user từ localStorage (khi reload vẫn giữ trạng thái đăng nhập)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Khi đăng nhập thành công
  const login = (userData) => {
    const fixedUser = {
      ...userData,
      id: userData.id || userData._id, // 👈 thêm dòng này để đảm bảo có id
    };

    setUser(fixedUser);
    localStorage.setItem("user", JSON.stringify(fixedUser));
  };

  // ✅ Khi đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook tiện dụng
export const useAuth = () => useContext(AuthContext);
