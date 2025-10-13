import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart, User, Search, Phone, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import SidebarMenu from "../components/sidebarmenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full shadow-sm border-b">
      {/* --- Top header --- */}
      <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
        {/* Left side: logo + menu button (mobile) */}
        <div className="flex items-center gap-2">
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
            <span className="text-blue-600 font-extrabold md:text-5xl text-3xl font-[Birthstone]">SkyWind</span>
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

           <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4 text-gray-700 hover:bg-blue-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-4" >
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
        
          <Link
            to="/login"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            <User className="h-5 w-5" />
            <span className="hidden md:inline text-sm font-medium">Đăng nhập</span>
          </Link>

          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
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
          <Button
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-white font-medium hover:bg-blue-700 hover:text-white"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
            Danh mục sản phẩm
          </Button>


          <div className="flex items-center gap-4 font-medium">
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> Hotline: <b>01.2345.6789</b>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
