import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";

export default function HeaderBottom({ setOpen }) {
  return (
    <div className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Danh mục sản phẩm */}
        <Button
          variant="ghost"
          onClick={() => setOpen(true)} // ✅ Gọi hàm từ HeaderTop
          className="flex items-center gap-2 text-white font-medium hover:bg-blue-700/20 transition-all duration-200 rounded-lg px-4 py-2 group"
        >
          <Menu className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Danh mục sản phẩm</span>
        </Button>

        {/* Hotline */}
        <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
          <Phone className="h-4 w-4 animate-pulse text-blue-100" />
          <span className="opacity-90">Hotline:</span>
          <b className="text-white tracking-wide hover:text-yellow-200 transition">
            01.2345.6789
          </b>
        </div>
      </div>
    </div>
  );
}
