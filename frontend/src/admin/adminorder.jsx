import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => console.error("Lỗi khi tải danh sách đơn hàng"));
  }, []);

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
              {orders.map((order) => (
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
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
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
