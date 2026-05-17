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

      // ⚡ FIX: đảm bảo luôn lấy đúng user_id từ backend
      id: userData.user_id || userData.id || userData._id || null,

      // ⚡ FIX: đảm bảo role luôn tồn tại
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
