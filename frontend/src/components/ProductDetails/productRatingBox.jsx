import React from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ProductRatingBox({ product }) {
  const rating = product.rating ?? 0;
  const totalReviews = product.reviews ?? 0;

  return (
    <Card className="p-5 border border-gray-200 shadow-sm mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Đánh giá & Nhận xét {product.name}
      </h2>

      <div className="flex items-center gap-3">
        <p className="text-4xl font-bold text-gray-900">{rating}</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">({totalReviews} đánh giá)</p>
      </div>
    </Card>
  );
}
