import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Users, Box, Upload, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import AdminUser from "@/admin/adminuser";
import AdminProduct from "@/admin/adminproduct";
import UploadImage from "@/components/UploadImage";
import AdminOverview from "@/admin/adminoverview"; 
import AdminOrders from "@/admin/adminorder";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("Admin");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // ⭐ FIX: dùng sessionStorage thay vì localStorage
    const savedUser = sessionStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // Nếu có username → hiển thị
        if (parsedUser?.username) {
          setUsername(parsedUser.username);
        } else {
          navigate("/login", { replace: true });
        }
      } catch {
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ⭐ FIX logout đúng
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // ⭐ Menu Admin
  const menuItems = [
    { path: "/admin", label: "Tổng quan", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/products", label: "Sản phẩm", icon: <Box size={20} /> },
    { path: "/admin/orders", label: "Đơn hàng", icon: <ShoppingCart size={20} /> },
    { path: "/admin/users", label: "Người dùng", icon: <Users size={20} /> },
    { path: "/admin/upload", label: "Upload", icon: <Upload size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* 🌙 Sidebar */}
      <motion.aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        animate={{ width: isExpanded ? 220 : 80 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-b from-blue-700 to-blue-800 text-white flex flex-col justify-between shadow-lg p-4"
      >
        <div>
          <div className="flex items-center justify-center mb-8">
            <h2
              className={`text-xl font-bold tracking-wide transition-all duration-300 ${
                !isExpanded && "opacity-0 w-0"
              }`}
            >
              Admin
            </h2>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive ? "bg-blue-600 shadow-md" : "hover:bg-blue-600/70"
                  }`}
                >
                  {item.icon}
                  {isExpanded && <span className="text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center border-t border-blue-500 pt-3">
          {isExpanded && (
            <p className="text-sm mb-2">
              Xin chào, <span className="font-semibold">{username}</span>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
          <p className="text-[10px] opacity-75 mt-2">© 2025 SkyWind</p>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <motion.div
          className="flex-1 p-6 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Bảng điều khiển Admin
          </h2>

          {/* Admin router */}
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="upload" element={<UploadImage />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  );
}

