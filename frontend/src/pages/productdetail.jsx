import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import ProductImages from "@/components/ProductDetails/productImages";
import ProductPriceBox from "@/components/ProductDetails/productPriceBox";
import ProductPromoBox from "@/components/ProductDetails/productPromoBox";
import ProductActionBox from "@/components/ProductDetails/productActionBox";
import ProductSpecsTable from "@/components/ProductDetails/productSpecsTable";
import ProductRatingBox from "@/components/ProductDetails/productRatingBox";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const ratingRef = useRef(null);
  const [highlight, setHighlight] = useState(false);

  const scrollToRating = () => {
    if (ratingRef.current) {
      ratingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlight(true);
      setTimeout(() => setHighlight(false), 2000);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/products/slug/${slug}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Không thể tải sản phẩm");

        // ✅ Chuẩn hóa dữ liệu để dùng thống nhất
        const fixedData = {
          ...data,
          id: data.product_id || data.id,
          images: Array.isArray(data.images) ? data.images : [],
          specifications: Array.isArray(data.specifications)
            ? data.specifications
            : [],
          promos: Array.isArray(data.promos) ? data.promos : [],
          // ✅ Chuẩn hóa tên biến tồn kho
          stock: data.stock ?? data.quantity ?? 0,
          outOfStock: (data.stock ?? data.quantity ?? 0) <= 0,
        };

        setProduct(fixedData);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, refresh]);

  const handleNewRating = () => {
    setRefresh((prev) => !prev);
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Đang tải sản phẩm...</p>;

  if (error)
    return <p className="text-center py-10 text-red-500">⚠️ {error}</p>;

  if (!product)
    return <p className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-500 mt-1">{product.description}</p>
      </div>

      {/* Hình ảnh + Giá */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-7/12">
          <ProductImages images={product.images} />
        </div>

        <div className="w-full lg:w-5/12 flex flex-col gap-5">
          <ProductPriceBox product={product} onViewRating={scrollToRating} />
          <ProductPromoBox promos={product.promos} />
          {/* ✅ Truyền stock và outOfStock xuống */}
          <ProductActionBox product={product} />
        </div>
      </div>

      {/* Thông số + Đánh giá */}
      <div className="mt-10 flex flex-col gap-6">
        {product.specifications.length > 0 ? (
          <ProductSpecsTable specs={product.specifications} />
        ) : (
          <p className="text-gray-500 italic text-center">
            Không có thông số kỹ thuật cho sản phẩm này.
          </p>
        )}

        <div
          ref={ratingRef}
          className={`transition-all duration-700 ${
            highlight ? "ring-4 ring-yellow-300 rounded-xl" : ""
          }`}
        >
          <ProductRatingBox product={product} onNewRating={handleNewRating} />
        </div>
      </div>
    </div>
  );
}
