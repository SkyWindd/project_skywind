import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState([]); // ✅ thêm state lưu đơn hàng

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Tự động tải đơn hàng khi người dùng mở tab "orders"
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) return;
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/orders/user/${user.id}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
      }
    };

    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, user]); // 👈 chạy lại khi đổi tab hoặc user đổi

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
    <div className="min-h-[80vh] bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-blue-600 mb-4">
              {user.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <nav className="mt-8 space-y-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "info"
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              🧾 Thông tin tài khoản
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "orders"
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              📦 Đơn hàng của tôi
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "address"
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              📍 Địa chỉ
            </button>

            <Button
              onClick={handleLogout}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
            >
              Đăng xuất
            </Button>
          </nav>
        </div>

        {/* Nội dung */}
        <div className="flex-1 p-8">
          {activeTab === "info" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                👤 Thông tin cá nhân
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Tên đăng nhập</p>
                  <p className="font-medium">{user.username || "Chưa có"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-medium">{user.email || "Không có email"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">📦 Đơn hàng của tôi</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="border rounded-xl p-5 bg-white shadow-sm"
                    >
                      <p className="font-medium">
                        Mã đơn hàng:{" "}
                        <span className="text-blue-600">{order.order_id}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Ngày đặt:{" "}
                        {new Date(order.order_date).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Trạng thái: {order.status}
                      </p>
                      <p className="text-gray-800 font-semibold mt-2">
                        Tổng cộng:{" "}
                        {Number(order.total_amount).toLocaleString()}₫
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "address" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">📍 Địa chỉ</h3>
              <p className="text-gray-500">
                Bạn chưa thêm địa chỉ giao hàng nào.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
