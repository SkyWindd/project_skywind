import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const STATUS_LIST = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang vận chuyển",
  "Đã giao xong",
  "Đã hủy"
];

const STATUS_COLORS = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-700",
  "Đã xác nhận": "bg-blue-100 text-blue-700",
  "Đang vận chuyển": "bg-purple-100 text-purple-700",
  "Đã giao xong": "bg-green-100 text-green-700",
  "Đã hủy": "bg-red-100 text-red-700"
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn hàng", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/orders/update-status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: newStatus })
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  const filteredOrders =
    filterStatus === "Tất cả"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Quản lý đơn hàng
      </h2>

      {/* Tabs trạng thái */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-1 rounded font-semibold ${
            filterStatus === "Tất cả" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilterStatus("Tất cả")}
        >
          Tất cả
        </button>
        {STATUS_LIST.map((status) => (
          <button
            key={status}
            className={`px-4 py-1 rounded font-semibold ${
              filterStatus === status ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700">Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-t">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="px-4 py-2 text-left">Mã đơn</th>
                <th className="px-4 py-2 text-left">Người dùng</th>
                <th className="px-4 py-2 text-left">Tổng tiền</th>
                <th className="px-4 py-2 text-left">Ngày</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{order.order_id}</td>
                  <td className="px-4 py-2">{order.user_id}</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">
                    ${order.total_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{order.order_date}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.order_id, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-xs font-semibold border ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUS_LIST.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
