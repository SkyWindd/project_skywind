import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    // 🔹 Giả lập dữ liệu đơn hàng (sau này thay bằng API hoặc localStorage)
    const mockOrders = [
      {
        id: "DH001",
        date: "2025-11-02",
        total: 20490000,
        status: "Đang giao",
        items: [
          { name: "Laptop Lenovo LOQ 15", quantity: 1, price: 20490000 },
        ],
      },
      {
        id: "DH002",
        date: "2025-10-25",
        total: 15990000,
        status: "Hoàn tất",
        items: [
          { name: "Laptop Acer Nitro 5", quantity: 1, price: 15990000 },
        ],
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
        <Button onClick={() => navigate("/login")} className="ml-4 bg-blue-600 text-white">
          Đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📦 Đơn hàng của tôi
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium">
                  Mã đơn hàng: <span className="text-blue-600">{order.id}</span>
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Hoàn tất"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">
                Ngày đặt: {new Date(order.date).toLocaleDateString("vi-VN")}
              </p>

              <div className="border-t pt-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{item.price.toLocaleString()}₫</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{order.total.toLocaleString()}₫</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
