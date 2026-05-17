import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Order() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      console.log("⚠️ Không có user trong context");
      return;
    }

    // ✅ Đảm bảo có ID người dùng (vì backend có thể trả user_id thay vì id)
    const userId = user.id || user.user_id;

    if (!userId) {
      console.warn("⚠️ userId bị undefined. Kiểm tra lại dữ liệu user:", user);
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log("📡 Gọi API với userId:", userId);
        const res = await axios.get(`/api/orders/user/${userId}`)
        console.log("📦 Dữ liệu đơn hàng trả về:", res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải đơn hàng:", error);
      }
    };

    fetchOrders();
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
              key={order.order_id}
              className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Thông tin đơn hàng */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium">
                  Mã đơn hàng:{" "}
                  <span className="text-blue-600">{order.order_id}</span>
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

              {/* Ngày đặt */}
              <p className="text-gray-600 text-sm mb-2">
                Ngày đặt:{" "}
                {new Date(order.order_date).toLocaleDateString("vi-VN")}
              </p>

              {/* Danh sách sản phẩm */}
              <div className="border-t pt-3 space-y-2">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>{Number(item.price).toLocaleString()}₫</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có sản phẩm.</p>
                )}
              </div>

              {/* Thanh toán */}
              <div className="border-t mt-3 pt-3 flex justify-between text-sm text-gray-600">
                <span>Phương thức thanh toán:</span>
                <span className="font-medium uppercase">
                  {order.payment?.method === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : order.payment?.method || "Không rõ"}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Trạng thái thanh toán:</span>
                <span className="font-medium">
                  {order.payment?.status || "Chờ xử lý"}
                </span>
              </div>

              {/* Tổng cộng */}
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {Number(order.total_amount).toLocaleString()}₫
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
