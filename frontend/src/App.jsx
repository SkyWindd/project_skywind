import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgotpassword";
import Laptop from "@/pages/laptop";
import UploadImage from "./components/UploadImage";

export default function App() {
  return (
    <>
      <Routes>
        {/* Dùng MainLayout để bọc các trang chính */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="laptop" element={<Laptop />} />
          {/* 👇 Thêm route upload ảnh */}
          <Route path="upload" element={<UploadImage />} />
        </Route>
      </Routes>
    </>
  );
}
