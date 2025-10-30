import { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    users: 0,
    growth: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [productRes, userRes, orderRes] = await Promise.all([
        axios.get(`${API_BASE}/products`),
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/orders`),
      ]);

      const products = productRes.data || [];
      const users = userRes.data || [];
      const orders = orderRes.data || [];

      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.total_price || 0),
        0
      );

      const monthlyRevenue = [
        { month: "Jan", revenue: 8000 },
        { month: "Feb", revenue: 12500 },
        { month: "Mar", revenue: 9800 },
        { month: "Apr", revenue: 14300 },
        { month: "May", revenue: 17200 },
        { month: "Jun", revenue: 15600 },
        { month: "Jul", revenue: 18200 },
      ];

      setStats({
        revenue: totalRevenue || 120000,
        totalOrders: orders.length,
        users: users.length,
        growth: 4.8,
      });
      setChartData(monthlyRevenue);
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Lỗi khi tải dashboard:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-700">
        📊 Bảng điều khiển tổng quan
      </h1>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="text-green-600" size={28} />}
          title="Doanh thu"
          value={`${stats.revenue.toLocaleString()} ₫`}
          growth="+8.2%"
        />
        <StatCard
          icon={<ShoppingBag className="text-blue-600" size={28} />}
          title="Đơn hàng"
          value={stats.totalOrders}
          growth="+3.4%"
        />
        <StatCard
          icon={<Users className="text-purple-600" size={28} />}
          title="Người dùng"
          value={stats.users}
          growth="+5.1%"
        />
        <StatCard
          icon={<TrendingUp className="text-orange-600" size={28} />}
          title="Tăng trưởng"
          value={`${stats.growth}%`}
          growth="+0.7%"
        />
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Biểu đồ doanh thu theo tháng
        </h2>

        {/* 👇 FIX: ResponsiveContainer cần chiều cao cha cố định */}
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Đơn hàng gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">Mã đơn</th>
                <th>Tên khách</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((o) => (
                  <tr key={o.order_id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{o.order_id}</td>
                    <td>{o.customer_name}</td>
                    <td>
                      {new Date(o.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{o.total_price?.toLocaleString()} ₫</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          o.status === "Đã giao"
                            ? "bg-green-100 text-green-700"
                            : o.status === "Đang xử lý"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-3 text-gray-500">
                    Không có đơn hàng gần đây
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Component con hiển thị thẻ thống kê
function StatCard({ icon, title, value, growth }) {
  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        <p className="text-green-600 text-xs mt-1">{growth}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">{icon}</div>
    </div>
  );
}
