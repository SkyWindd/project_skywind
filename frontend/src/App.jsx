import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgotpassword";
import Product from "@/pages/product";
import UploadImage from "./components/UploadImage";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminDashboard from "@/pages/admindasboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Layout người dùng */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="laptop" element={<Product />} />
            <Route path="upload" element={<UploadImage />} />
          </Route>

          {/* 🔒 Route admin có phân quyền */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Trang lỗi quyền hạn (tuỳ chọn) */}
          <Route path="/unauthorized" element={<h1>Không có quyền truy cập 🚫</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
