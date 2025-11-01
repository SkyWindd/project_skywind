// src/admin/AdminOverview.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ thêm dòng này
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingBag, Users, TrendingUp, Box } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate(); // ✅ hook điều hướng

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/stats")
      .then((res) => res.json())
      .then(setStats);

    fetch("http://localhost:5000/dashboard/revenue-chart")
      .then((res) => res.json())
      .then(setChartData);

    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => setRecentOrders(data.slice(0, 5)));
  }, []);

  if (!stats) return <p className="text-gray-600">Đang tải dữ liệu...</p>;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Tổng quan hệ thống
      </h2>

      {/* 🌟 Thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Tổng doanh thu"
          value={`$${stats.total_revenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          gradient="from-blue-700 to-blue-800"
        />
        <StatCard
          title="Người dùng"
          value={stats.total_users}
          icon={<Users size={24} />}
          gradient="from-blue-600 to-blue-700"
          onClick={() => navigate("/admin/users")} // ✅ click chuyển trang users
        />
        <StatCard
        title="Sản phẩm"
        value={stats.total_products} // ✅ hiển thị số lượng sản phẩm
        icon={<Box size={24} />}
        gradient="from-blue-500 to-blue-600"
        onClick={() => navigate("/admin/products")}
        />
        <StatCard
          title="Đơn hàng"
          value={stats.total_orders}
          icon={<ShoppingBag size={24} />}
          gradient="from-blue-400 to-blue-500"
          onClick={() => navigate("/admin/orders")} // ✅ click chuyển trang orders
        />
      </div>

      {/* 📈 Biểu đồ doanh thu */}
      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700">Biểu đồ doanh thu 7 ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 🧾 Đơn hàng gần nhất */}
      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700">Đơn hàng gần nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-t">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Tổng tiền</th>
                <th className="px-4 py-2 text-left">Ngày</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
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

/* 💎 Component thống kê có thể click */
function StatCard({ title, value, icon, gradient, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={onClick}
      className={`cursor-pointer`}
    >
      <Card
        className={`bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-xl`}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            {icon}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
