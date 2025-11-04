import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import productApi from "@/api/productApi";
import ProductCard from "@/components/Product/ProductCard"; // ✅ Dùng component hiển thị sản phẩm của bạn

export default function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await productApi.getAll(); // ✅ gọi API có sẵn
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [query]);

  if (loading) return <p className="text-center py-10">Đang tải sản phẩm...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-blue-600">“{query}”</span>
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
