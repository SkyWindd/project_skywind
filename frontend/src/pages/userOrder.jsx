import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OrderFilterBar from "@/components/Orders/orderFilterBar";
import OrderList from "@/components/Orders/orderList";

export default function Order() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    // 🔹 Giả lập dữ liệu đơn hàng (sau này thay bằng API)
    const mockOrders = [
      {
        id: "DH001",
        date: "2025-11-02",
        total: 20490000,
        status: "Đang giao",
        items: [
          { name: "Laptop Lenovo LOQ 15", quantity: 1, price: 20490000 },
        ],
        image: "https://via.placeholder.com/80",
      },
      {
        id: "DH002",
        date: "2025-10-25",
        total: 15990000,
        status: "Hoàn tất",
        items: [
          { name: "Laptop Acer Nitro 5", quantity: 1, price: 15990000 },
        ],
        image: "https://via.placeholder.com/80",
      },
    ];

    setOrders(mockOrders);
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">
          ⚠️ Bạn cần đăng nhập để xem đơn hàng của mình.
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="ml-4 bg-blue-600 text-white"
        >
          Đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📦 Đơn hàng của tôi
      </h2>

      {/* 🔹 Thanh lọc đơn hàng (tabs + date picker) */}
      <OrderFilterBar />

      {/* 🔹 Danh sách đơn hàng */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
}
