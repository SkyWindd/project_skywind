import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut, Bell } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    { title: "Người dùng", value: 128, icon: <Users size={20} /> },
    { title: "Sản phẩm", value: 56, icon: <Package size={20} /> },
    { title: "Đơn hàng", value: 42, icon: <ShoppingCart size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-blue-600 flex items-center gap-2">
          <LayoutDashboard size={20} /> Admin Panel
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600 gap-2"
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600 gap-2"
            onClick={() => navigate("/admin/products")}
          >
            <Package size={18} /> Quản lý sản phẩm
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600 gap-2"
            onClick={() => navigate("/admin/users")}
          >
            <Users size={18} /> Quản lý người dùng
          </Button>
        </nav>

        <div className="p-4 border-t border-blue-600">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full flex items-center gap-2"
          >
            <LogOut size={18} /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Trang quản trị</h1>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 hover:text-blue-600">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name || "Admin"}</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <Card key={s.title} className="shadow-sm">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-700">{s.title}</CardTitle>
                  {s.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-700">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
