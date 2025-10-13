import { Link } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SidebarMenu({ onClose }) {
  const categories = [
    "Asus",
    "Acer",
    "Dell",
    "HP",
    "Lenovo",
    "MSI"
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold text-gray-700">Danh mục sản phẩm</span>
      </div>

      {/* Menu list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {categories.map((item, i) => (
          <Link
            key={i}
            to={`/product/${item}`}
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <span>{item}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ))}
      </div>

      <Separator />
      {/* Footer links */}
      <div className="p-4 space-y-2 text-sm">
        <Link to="/about" className="block hover:text-blue-600">
          Giới thiệu SkyWind
        </Link>
      </div>
    </div>
  );
}
