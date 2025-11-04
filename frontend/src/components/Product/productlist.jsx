import { useEffect, useState } from "react";
import ProductCard from "@/components/Product/productcard";
import productApi from "@/api/productApi";

export default function ProductList({ title = "Danh sách sản phẩm", filters = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data =
          Object.keys(filters).length > 0
            ? await productApi.filter(filters)
            : await productApi.getAll();

        const mapped = data.map((item) => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          old_price: item.old_price || item.price,
          discount_percent: item.discount_percent ?? null,
          stock: item.stock,
          brand_id: item.brand_id,
          cpu: item.cpu,
          ram: item.ram,
          ssd: item.ssd,
          vga: item.vga,
          man_hinh: item.man_hinh,
          images: item.images || [],
          is_hot: item.is_hot || false,
          rating: item.rating ?? 0,
          reviews: item.reviews ?? 0,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10 animate-pulse">Đang tải sản phẩm...</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-10">Không có sản phẩm nào.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
