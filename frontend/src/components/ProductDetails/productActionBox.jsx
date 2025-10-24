import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard } from "lucide-react";

export default function ProductActionBox({ product }) {
  return (
    <div className="space-y-3">
      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-6 rounded-md">
        <CreditCard className="mr-2 w-4 h-4" /> MUA NGAY
      </Button>

      <Button
        variant="outline"
        className="w-full border border-red-600 text-red-600 hover:bg-red-50 font-semibold py-6 rounded-md"
        onClick={() => alert(`🛒 Đã thêm ${product.name} vào giỏ hàng`)}
      >
        <ShoppingCart className="mr-2 w-4 h-4" /> THÊM VÀO GIỎ HÀNG
      </Button>
    </div>
  );
}
