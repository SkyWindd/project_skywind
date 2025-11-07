import React from "react";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, LogOut } from "lucide-react";

export default function ProfileSidebar({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-full md:w-1/3 bg-gradient-to-b from-gray-50 to-white border-b md:border-b-0 md:border-r border-gray-200 p-8 flex flex-col justify-between">
      {/* Thông tin người dùng */}
      <div>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 flex items-center justify-center text-4xl font-bold text-blue-700 shadow-sm mb-4">
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
          <p className="text-gray-500 text-sm break-all mt-1">{user.email}</p>
        </div>

        {/* Menu */}
        <nav className="mt-10 flex flex-col space-y-1.5">
          <SidebarItem
            icon={<User size={18} />}
            label="Thông tin tài khoản"
            active={activeTab === "info"}
            onClick={() => setActiveTab("info")}
          />
          <SidebarItem
            icon={<Package size={18} />}
            label="Đơn hàng của tôi"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          <SidebarItem
            icon={<MapPin size={18} />}
            label="Địa chỉ"
            active={activeTab === "address"}
            onClick={() => setActiveTab("address")}
          />
        </nav>
      </div>

      {/* Nút đăng xuất */}
      <div className="mt-8 border-t pt-5">
        <Button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.98]"
        >
          <LogOut size={16} /> Đăng xuất
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all text-sm font-medium tracking-wide group ${
        active
          ? "bg-blue-100 text-blue-700 shadow-sm"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      <span
        className={`transition-transform duration-200 ${
          active ? "scale-110 text-blue-600" : "group-hover:scale-110"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
