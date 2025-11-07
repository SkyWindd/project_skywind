import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileLayout from "@/components/Profile/ProfileLayout";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import ProfileOrders from "@/components/Profile/ProfileOrders";
import ProfileAddress from "@/components/Profile/ProfileAddress";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 Nếu được điều hướng từ nơi khác (ví dụ HeaderRight)
  useEffect(() => {
    if (location.state?.section) {
      setActiveTab(location.state.section);

      // Xóa state sau khi xử lý để tránh giữ khi reload lại
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 🔹 Lấy danh sách đơn hàng khi chuyển sang tab "orders"
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/orders/user/${user.id}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
      }
    };
    if (activeTab === "orders") fetchOrders();
  }, [activeTab, user]);

  // 🔹 Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">
          ⚠️ Bạn cần đăng nhập để xem thông tin cá nhân.
        </p>
      </div>
    );
  }

  return (
    <ProfileLayout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === "info" && <ProfileInfo user={user} />}
      {activeTab === "orders" && <ProfileOrders orders={orders} />}
      {activeTab === "address" && <ProfileAddress />}
    </ProfileLayout>
  );
}
