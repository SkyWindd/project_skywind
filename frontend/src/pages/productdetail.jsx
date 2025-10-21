// src/pages/ProductDetails.jsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductImages from "../components/productimage";
import ProductInfo from "../components/productinfo";
import SpecsTable from "../components/specstable";
import { mockProducts } from "../data/mockProduct";
import Rating from "@/components/rating";

/**
 * Route suggestion: /laptop/:slug
 * Put this file in src/pages/ProductDetails.jsx or as you prefer.
 */
export default function ProductDetails() {
  const { slug } = useParams();

  // find product by slug (mock). If not found, fallback to mockProduct.
  const product = useMemo(() => {
    if (!slug) return mockProducts;
    // If you have multiple products in mock, search by slug:
    // return mockProducts.find((p) => p.slug === slug) || mockProduct;
     return mockProducts.find((p) => p.slug === slug);
}, [slug]);

  const handleAddToCart = (prod) => {
    // TODO: integrate with CartContext / API
    console.log("Add to cart", prod.id);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Top area: images (left) and info (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ProductImages images={product.images} />
          {/* highlights */}
        
        </div>

        <div className="lg:col-span-5">
          <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* Specs */}
      <SpecsTable specs={product.specs} />

      {/* Reviews placeholder */}
      <Rating productId={product.id} />
    </div>
  );
}
