import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Box,
} from "lucide-react";

import { motion } from "framer-motion";

export default function AdminOverview() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, chartRes, ordersRes] = await Promise.all([
        fetch("http://localhost:8000/admin/dashboard/stats"),
        fetch("http://localhost:8000/admin/dashboard/revenue-chart"),
        fetch("http://localhost:8000/orders/api/orders"),
      ]);

      if (!statsRes.ok) {
        throw new Error("Không tải được thống kê");
      }

      if (!chartRes.ok) {
        throw new Error("Không tải được biểu đồ");
      }

      if (!ordersRes.ok) {
        throw new Error("Không tải được đơn hàng");
      }

      const statsData = await statsRes.json();
      const chartDataRes = await chartRes.json();
      const ordersData = await ordersRes.json();

      setStats({
        total_users: statsData.total_users || 0,
        total_products: statsData.total_products || 0,
        total_orders: statsData.total_orders || 0,
        total_revenue: statsData.total_revenue || 0,
      });

      setChartData(
        Array.isArray(chartDataRes)
          ? chartDataRes
          : []
      );

      let orderList = [];

      if (Array.isArray(ordersData)) {
        orderList = ordersData;
      } else if (ordersData.orders) {
        orderList = ordersData.orders;
      }

      setRecentOrders(orderList.slice(0, 5));

    } catch (error) {
      console.error("❌ Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500 animate-pulse">
          Đang tải dữ liệu dashboard...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700">
          Tổng quan hệ thống
        </h1>

        <p className="text-gray-500 mt-1">
          Theo dõi hoạt động hệ thống SkyWind
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Tổng doanh thu"
          value={`${Number(
            stats.total_revenue || 0
          ).toLocaleString("vi-VN")}đ`}
          icon={<DollarSign size={24} />}
          gradient="from-blue-700 to-blue-800"
        />

        <StatCard
          title="Người dùng"
          value={stats.total_users}
          icon={<Users size={24} />}
          gradient="from-blue-600 to-blue-700"
          onClick={() => navigate("/admin/users")}
        />

        <StatCard
          title="Sản phẩm"
          value={stats.total_products}
          icon={<Box size={24} />}
          gradient="from-blue-500 to-blue-600"
          onClick={() => navigate("/admin/products")}
        />

        <StatCard
          title="Đơn hàng"
          value={stats.total_orders}
          icon={<ShoppingBag size={24} />}
          gradient="from-blue-400 to-blue-500"
          onClick={() => navigate("/admin/orders")}
        />

      </div>

      {/* CHART */}
      <Card className="shadow-lg border-0 rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700 text-xl">
            Doanh thu 7 ngày gần nhất
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-80">

            {chartData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Không có dữ liệu doanh thu
                </p>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* RECENT ORDERS */}
      <Card className="shadow-lg border-0 rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700 text-xl">
            Đơn hàng gần đây
          </CardTitle>
        </CardHeader>

        <CardContent>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Tổng tiền</th>
                    <th className="px-4 py-3 text-left">Ngày</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>

                <tbody>

                  {recentOrders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">
                        #{order.order_id}
                      </td>

                      <td className="px-4 py-3">
                        {order.user_id}
                      </td>

                      <td className="px-4 py-3 text-green-600 font-semibold">
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString("vi-VN")}đ
                      </td>

                      <td className="px-4 py-3">
                        {order.order_date
                          ? new Date(
                              order.order_date
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>

                      <td className="px-4 py-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status || "Unknown"}
                        </span>

                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">
                Không có đơn hàng gần đây
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </motion.div>
  );
}

/* =========================================
   STAT CARD
========================================= */
function StatCard({
  title,
  value,
  icon,
  gradient,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{
        type: "spring",
        stiffness: 200,
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card
        className={`bg-gradient-to-br ${gradient} text-white shadow-lg border-0 rounded-2xl hover:shadow-2xl transition`}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>{title}</span>
            {icon}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
