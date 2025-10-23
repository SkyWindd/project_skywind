import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  Phone,
  Upload,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import SidebarMenu from "../components/sidebarmenu";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full shadow-sm border-b">
      {/* --- Top header --- */}
      <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
        {/* Left side: logo + menu button (mobile) */}
        <div className="flex items-center gap-2">
          {/* Sidebar menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:text-blue-600"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarMenu onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-blue-600 font-extrabold md:text-5xl text-3xl font-[Birthstone]">
              SkyWind
            </span>
          </Link>
        </div>

        {/* Search bar (hidden on mobile) */}
        <div className="hidden md:flex items-center w-1/2 bg-white border rounded-full overflow-hidden">
          <Input
            placeholder="Tìm theo tên sản phẩm..."
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 text-sm"
          />
          <Button className="bg-blue-600 rounded-none rounded-r-full px-4 hover:bg-blue-700">
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Right side: account + cart */}
        <div className="flex items-center gap-4">
          {/* Search button (mobile) */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4 text-gray-700 hover:text-blue-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="p-4">
                <div className="flex items-center w-full bg-white border rounded-full overflow-hidden">
                  <Input
                    placeholder="Tìm theo tên sản phẩm..."
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 text-sm"
                  />
                  <Button className="bg-blue-600 rounded-none rounded-r-full px-4 hover:bg-blue-700">
                    <Search className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 👇 Nếu đã đăng nhập */}
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
                  <Settings className="h-4 w-4" />
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Đơn hàng của tôi
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>   
          ) : (
            /* 👇 Nếu chưa đăng nhập */
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

          {/* Giỏ hàng */}
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* --- Bottom navigation bar --- */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm">
        <div className="hidden md:flex max-w-screen-xl mx-auto items-center justify-between px-4 py-2">
          {/* Nút danh mục sản phẩm */}
          <Button
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-white font-medium hover:bg-blue-700 hover:text-white"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
            Danh mục sản phẩm
          </Button>

          {/* 🔗 Các liên kết điều hướng */}
          <div className="flex items-center gap-6 font-medium">

            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> Hotline: <b>01.2345.6789</b>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
