import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ thêm dòng này

import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgotpassword";
import Product from "@/pages/product";
import ProductDetails from "@/pages/productdetail";
import CheckoutInfo from "@/pages/checkoutInfo";
import UploadImage from "@/components/UploadImage";
import SearchResults from "@/pages/SearchResults";
import Profile from "@/pages/profile";
import Order from "@/pages/order";
import AdminDashboard from "@/admin/admindasboard";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="1023332032947-c0ao141cco290tnrbbr7darlivpsr934.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster richColors position="top-right" />

            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgotpassword" element={<ForgotPassword />} />
                <Route path="laptop" element={<Product />} />
                <Route path="laptop/:slug" element={<ProductDetails />} />
                <Route path="checkout-info" element={<CheckoutInfo />} />
                <Route path="upload" element={<UploadImage />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="profile" element={<Profile />} />
                <Route path="order" element={<Order />} />
              </Route>

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/unauthorized"
                element={
                  <h1 className="text-center p-10 text-red-600 font-semibold text-lg">
                    Không có quyền truy cập 🚫
                  </h1>
                }
              />

              <Route
                path="*"
                element={
                  <h1 className="text-center p-10 text-gray-600 font-semibold text-lg">
                    404 - Trang không tồn tại
                  </h1>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
