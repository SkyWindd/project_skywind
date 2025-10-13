import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Cpu, HardDrive, Monitor, Gauge, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Card className="relative hover:shadow-lg transition rounded-xl border border-gray-100 flex flex-col h-full">
      {/* Hình ảnh sản phẩm */}
      <CardHeader className="p-0">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain rounded-t-xl transition-transform duration-200 hover:scale-105"
          />
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Tên sản phẩm */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Thông tin cấu hình */}
        <div className="bg-gray-100 text-gray-700 rounded-lg p-2 text-xs mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" /> {product.cpu}
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5" /> {product.ram} • {product.storage}
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5" /> {product.display}
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5" /> {product.refreshRate}
          </div>
        </div>

        {/* Giá sản phẩm */}
        <div className="mt-3">
          <p className="text-gray-400 line-through text-sm">{product.oldPrice}</p>
          <div className="flex items-center gap-2">
            <p className="text-red-600 font-bold text-lg">{product.newPrice}</p>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-medium">
              {product.discount}
            </span>
          </div>
        </div>

        {/* Đánh giá */}
        <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400" />
          <span>{product.rating}</span>
          <span className="text-gray-500 text-xs">
            ({product.reviews} đánh giá)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
