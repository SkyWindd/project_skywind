import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Cpu, HardDrive, Monitor, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const discountPercent =
    product.discount_percent ??
    (product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null);

  const slug = product.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const productLink = `/laptop/${slug}`;

  // ✅ Xử lý sao và đánh giá an toàn
  const avgRating = Number(product.avg_rating || 0);
  const fullStars = Math.floor(avgRating);
  const hasHalfStar = avgRating - fullStars >= 0.5;

  return (
    <Card className="relative hover:shadow-lg transition rounded-xl border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Nhãn giảm giá */}
      {discountPercent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md z-10">
          -{discountPercent}%
        </div>
      )}

      {/* Hình ảnh */}
      <CardHeader className="p-0 relative">
        <Link to={productLink} state={{ id: product.product_id }}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-contain bg-white rounded-t-xl transition-transform duration-200 hover:scale-105"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-xl">
              Không có hình
            </div>
          )}
        </Link>
      </CardHeader>

      {/* Nội dung */}
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link to={productLink} state={{ id: product.product_id }}>
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
            <HardDrive className="w-3.5 h-3.5" /> {product.ram} • {product.ssd}
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5" /> {product.man_hinh}
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5" /> {product.vga}
          </div>
        </div>

        {/* Giá */}
        <div className="mt-3">
          {product.old_price && product.old_price > product.price ? (
            <>
              <div className="flex items-center gap-2">
                <p className="text-gray-400 line-through text-sm">
                  {Number(product.old_price).toLocaleString("vi-VN")}₫
                </p>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-medium">
                  -{discountPercent}%
                </span>
              </div>
              <p className="text-red-600 font-bold text-lg">
                {Number(product.price).toLocaleString("vi-VN")}₫
              </p>
            </>
          ) : (
            <p className="text-red-600 font-bold text-lg">
              {Number(product.price).toLocaleString("vi-VN")}₫
            </p>
          )}

          {/* Tồn kho */}
          <div className="flex items-center gap-1 mt-1">
            {product.stock > 0 ? (
              <span className="text-green-600 text-xs font-medium">Còn hàng</span>
            ) : (
              <span className="text-red-500 text-xs font-medium">Hết hàng</span>
            )}
          </div>

          {/* ⭐ Đánh giá */}
          <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
            {[...Array(5)].map((_, i) => {
              if (i < fullStars)
                return (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#facc15"
                    stroke="#facc15"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.049 2.927a.75.75 0 011.402 0l1.637 4.341 4.66.18a.75.75 0 01.43 1.37l-3.61 2.944 1.234 4.53a.75.75 0 01-1.14.832L10 14.347l-3.662 2.777a.75.75 0 01-1.14-.832l1.234-4.53-3.61-2.944a.75.75 0 01.43-1.37l4.66-.18L9.049 2.927z"
                      clipRule="evenodd"
                    />
                  </svg>
                );
              else if (i === fullStars && hasHalfStar)
                return (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="w-4 h-4"
                  >
                    <defs>
                      <linearGradient id={`half-${product.product_id}`}>
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="50%" stopColor="none" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#half-${product.product_id})`}
                      stroke="#facc15"
                      d="M9.049 2.927a.75.75 0 011.402 0l1.637 4.341 4.66.18a.75.75 0 01.43 1.37l-3.61 2.944 1.234 4.53a.75.75 0 01-1.14.832L10 14.347l-3.662 2.777a.75.75 0 01-1.14-.832l1.234-4.53-3.61-2.944a.75.75 0 01.43-1.37l4.66-.18L9.049 2.927z"
                    />
                  </svg>
                );
              else
                return (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#facc15"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.049 2.927a.75.75 0 011.402 0l1.637 4.341 4.66.18a.75.75 0 01.43 1.37l-3.61 2.944 1.234 4.53a.75.75 0 01-1.14.832L10 14.347l-3.662 2.777a.75.75 0 01-1.14-.832l1.234-4.53-3.61-2.944a.75.75 0 01.43-1.37l4.66-.18L9.049 2.927z"
                      clipRule="evenodd"
                    />
                  </svg>
                );
            })}
            <span className="text-gray-700 text-sm ml-1">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-xs">
              ({product.rating_count ?? 0} đánh giá)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
