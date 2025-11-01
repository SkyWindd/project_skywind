import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";

export default function HeaderBottom({ setOpen }) {
  return (
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

        <div className="flex items-center gap-6 font-medium">
          <span className="flex items-center gap-1">
            <Phone className="h-4 w-4" /> Hotline: <b>01.2345.6789</b>
          </span>
        </div>
      </div>
    </div>
  );
}
