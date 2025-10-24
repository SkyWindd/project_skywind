import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function ProductPriceBox({ product, onViewRating }) {
  const discountPercent = Math.round(
    ((product.old_price - product.price) / product.old_price) * 100
  );

  return (
    <Card className="border border-gray-200 shadow-sm p-5 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-start">
        {/* Giá sau giảm */}
        <div className="flex-1">
          <p className="text-sm text-gray-500">Giá sản phẩm</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">
              {product.price.toLocaleString("vi-VN")}₫
            </p>
            <Badge
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-0.5 rounded-md"
            >
              -{discountPercent}%
            </Badge>
          </div>
        </div>

        {/* Giá gốc */}
        <div className="flex-1 border-l border-gray-200 pl-5">
          <p className="text-sm text-gray-500">Giá gốc</p>
          <p className="line-through text-gray-400 font-medium text-lg">
            {product.old_price.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>

      <Separator className="my-3" />

      {/* Link định giá + xem đánh giá */}
      <div className="flex justify-between items-center text-sm">
        <button
          onClick={onViewRating}
          className="text-yellow-600 flex items-center gap-1 hover:underline"
        >
          <Star className="w-4 h-4 fill-yellow-400" /> Xem đánh giá
        </button>
      </div>
    </Card>
  );
}
