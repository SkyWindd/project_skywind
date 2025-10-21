import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SidebarMenu({ onClose }) {
  const categories = ["Asus", "Acer", "Dell", "HP", "Lenovo", "MSI"];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold text-gray-700">Danh mục sản phẩm</span>
        {/* ❌ Đã xóa nút X ở đây */}
      </div>

      {/* Menu list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {categories.map((item) => (
          <Link
            key={item}
            to={`/laptop?brand=${encodeURIComponent(item)}`}
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <span>{item}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ))}

        {/* Xem tất cả */}
        <Link
          to="/laptop"
          onClick={onClose}
          className="flex items-center justify-between px-4 py-2 mt-2 rounded-md font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
        >
          Xem tất cả
        </Link>
      </div>

      <Separator />

      <div className="p-4 space-y-2 text-sm">
        <Link to="/about" className="block hover:text-blue-600">
          Giới thiệu SkyWind
        </Link>
      </div>
    </div>
  );
}
