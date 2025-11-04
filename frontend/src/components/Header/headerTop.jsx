import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarMenu from "../mainLayout/sideBarMenu";
import HeaderSearch from "./headerSearch.jsx";
import HeaderRight from "./HeaderRight";

export default function HeaderTop({ open, setOpen }) {
  return (
    <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
      {/* Left: Logo + Sidebar menu */}
      <div className="flex items-center gap-2">
        {/* Sidebar menu (mobile) */}
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

      {/* Search (desktop) */}
      <HeaderSearch />

      {/* Right: Account + Cart */}
      <HeaderRight />
    </div>
  );
}
