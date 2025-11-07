import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import HeaderSearch from "./headerSearch";
import HeaderRight from "./HeaderRight";
import SidebarMenu from "../mainLayout/sideBarMenu";

export default function HeaderTop({ open, setOpen }) {
  return (
    <div className="relative">
      {/* Thanh chính */}
      <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
        {/* Logo + Menu mobile */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(true)} // ✅ Bấm menu sẽ mở sidebar
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link
            to="/"
            className="flex items-center gap-1 text-blue-600 font-extrabold md:text-5xl text-3xl font-[Birthstone]"
          >
            SkyWind
          </Link>
        </div>

        {/* Search desktop */}
        <div className="hidden md:flex flex-1 justify-center">
          <HeaderSearch />
        </div>

        {/* Account + Cart */}
        <HeaderRight />
      </div>

      {/* Sidebar Menu */}
      <SidebarMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
