import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import MainLayout from "./layout/mainlayout"
import Home from "@/pages/home"
import Login from "@/pages/login"
import Register from "@/pages/register"
import ForgotPassword from "@/pages/forgotpassword"
import Product from "@/pages/product"
import ProductDetail from "./pages/productdetail"
import api from "./api/api.js";




export default function App() {
const [products, setProducts] = useState([]);

 useEffect(() => {
    api.get("/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Lỗi API:", err));
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="product" element={<Product />} />
            <Route path="" element={<ProductDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
