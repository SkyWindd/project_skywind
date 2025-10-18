// ==========================
// AuthContext.jsx
// File này dùng Context API để quản lý trạng thái đăng nhập toàn app
// ==========================

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider để bọc toàn bộ app
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  /**
   * authData sẽ lưu thông tin đăng nhập hiện tại
   * gồm token + user {id, email, role,...}
   * ban đầu nó null vì chưa ai đăng nhập
   */
  const [authData, setAuthData] = useState(null);

  // Khi F5 hoặc reload trang, lấy lại thông tin từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("authData");
    if (savedUser) {
      setAuthData(JSON.parse(savedUser));
    }
  }, []);

  // Hàm xử lý đăng nhập
  const login = (data) => {
    /**
     * data sẽ có dạng:
     * {
     *   token: "abc",
     *   user: { id, email, fullName, role }
     * }
     */
    setAuthData(data);
    localStorage.setItem("authData", JSON.stringify(data));

    // Điều hướng theo role
    if (data.user.role === "SysAdmin") {
      navigate("/"); // Sau này đổi lại "/admin/dashboard"
    } else {
      navigate("/");
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
    navigate("/login");
  };

  // Giá trị cung cấp cho toàn app
  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện dụng để dùng Auth ở component khác
export const useAuth = () => useContext(AuthContext);
