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
import {
  User,
  Settings,
  Package,
  LogOut,
  Car,
} from "lucide-react";
import HeaderSearch from "./headerSearch.jsx";
import CartDrawer from "../Cart/cartDrawer.jsx";
export default function HeaderRight() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      {/* Search (mobile) */}
      <div className="flex md:hidden">
        <HeaderSearch />
      </div>

      {/* User account */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100 rounded-full px-3"
            >
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700 hidden md:inline">
                {user.username || user.fullName || "Người dùng"}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" /> Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" /> Đơn hàng của tôi
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-600 font-medium"
            >
              <LogOut className="h-4 w-4" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
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
