// src/components/product/ProductInfo.jsx
import React from "react";
import { ShoppingCart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

/**
 * Props:
 *  - product: product object
 *  - onAddToCart(product)
 */
export default function ProductInfo({ product, onAddToCart }) {
  const priceFmt = (v) =>
    v?.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <h1 className="text-xl lg:text-2xl font-semibold">{product.name}</h1>
      <p className="text-sm text-muted-foreground">{product.shortDesc}</p>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-muted-foreground">Giá sản phẩm</div>
        <div className="flex items-baseline gap-4 mt-2">
          <div className="text-2xl lg:text-3xl font-extrabold text-red-600">{priceFmt(product.price)}</div>
          {product.listPrice && (
            <div className="text-sm text-gray-400 line-through">{priceFmt(product.listPrice)}</div>
          )}
        </div>


        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              toast.success("Chuyển tới thanh toán (demo)");
              if (onAddToCart) onAddToCart(product);
            }}
          >
            MUA NGAY
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              toast.success("Đã thêm vào giỏ (demo)");
              if (onAddToCart) onAddToCart(product);
            }}
          >
            <ShoppingCart size={16} />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    
    </div>
  );
}
