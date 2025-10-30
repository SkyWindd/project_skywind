import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Upload,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AdminSidebar() {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Quản lý sản phẩm", icon: Package },
    { to: "/admin/orders", label: "Quản lý đơn hàng", icon: ShoppingCart },
    { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
  ];

  return (
    <motion.aside
      className="bg-blue-600 text-white min-h-screen flex flex-col shadow-lg fixed top-0 left-0 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        width: isHovered ? 240 : 80,
      }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-blue-500">
        {isHovered ? (
          <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
        ) : (
          <span className="text-2xl font-extrabold">⚙️</span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex flex-col mt-6 space-y-1">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-800 font-semibold"
                  : "hover:bg-blue-700 hover:pl-5"
              }`
            }
          >
            <Icon size={22} />
            {isHovered && <span className="text-sm">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-blue-500 text-sm opacity-80">
        {isHovered ? "© 2025 SkyWind Admin" : "ⓘ"}
      </div>
    </motion.aside>
  );
}
