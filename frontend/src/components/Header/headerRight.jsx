import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { User, Settings, Package, LogOut } from "lucide-react";
import HeaderSearch from "./headerSearch.jsx";
import CartDrawer from "../Cart/cartDrawer.jsx";

export default function HeaderRight() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">

    {/* Search (mobile only) */}
    <div className="flex md:hidden">
      <HeaderSearch />
    </div>

      {/* User account */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 hover:bg-blue-50 rounded-full px-3 py-2 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold group-hover:bg-blue-200 transition">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">
                {user.username || user.fullName || "Người dùng"}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 rounded-lg shadow-md border border-gray-100 p-1 bg-white"
          >
            <DropdownMenuLabel className="text-gray-600 text-sm px-3 py-1.5">
              Tài khoản của tôi
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />

            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all cursor-pointer"
            >
              <Settings size={16} className="text-blue-500" />
              <span>Thông tin cá nhân</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigate("/profile", { state: { section: "orders" } })
              }
              className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all cursor-pointer"
            >
              <Package size={16} className="text-blue-500" />
              <span>Đơn hàng của tôi</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-200" />

            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer font-medium"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="hidden md:inline text-sm font-medium">
            Đăng nhập
          </span>
        </Link>
      )}

      {/* Cart */}
      <CartDrawer />
    </div>
  );
}
