import { useEffect, useState } from "react";
import FilterMenu from "@/components/filtermenu";
import SortMenu from "@/components/sort";
import FilterTags from "@/components/filtertags";
import PaginationSection from "@/components/pagination";
import ProductCard from "@/components/productcard";
import { useQueryParams } from "@/hooks/useQueryParams";
import productApi from "@/api/productApi";

export default function Laptop() {
  const { searchParams } = useQueryParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Lấy page riêng (chỉ dùng cho hiển thị, không fetch API)
  const page = parseInt(searchParams.get("page") || "1");

  // 🧩 Gom tất cả filter trừ "page"
  const getFilters = () => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "page" && value) obj[key] = value;
    }
    return obj;
  };

  // 🧩 Lưu filter riêng, chỉ thay đổi khi có filter mới
  const [filters, setFilters] = useState(getFilters());

  // 🔄 Cập nhật filters khi URL thay đổi (ngoại trừ chỉ page)
  useEffect(() => {
    const newFilters = getFilters();
    // Chỉ update nếu thực sự khác (bỏ qua page thay đổi)
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // 🧠 Chỉ gọi API khi filters thay đổi (page đổi sẽ KHÔNG gọi)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("🔍 Gửi bộ lọc lên backend:", filters);

        const data =
          Object.keys(filters).length > 0
            ? await productApi.filter(filters)
            : await productApi.getAll();

        console.log("📦 Kết quả API:", data);

        const mapped = data.map((item) => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          old_price: item.old_price || item.price,
          discount_percent: item.discount_percent ?? null,
          stock: item.stock,
          brand_id: item.brand_id,
          promo_id: item.promo_id,
          cpu: item.cpu,
          ram: item.ram,
          ssd: item.ssd,
          vga: item.vga,
          man_hinh: item.man_hinh,
          images: item.images || [],
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
  }, [JSON.stringify(filters)]); // ✅ chỉ khi filter đổi

  // --- Sắp xếp ---
  let filtered = [...products];
  const sort = searchParams.get("sort");
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

  // --- Phân trang ---
  const perPage = 20;
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10 animate-pulse">
        Đang tải sản phẩm...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <FilterMenu />
      <FilterTags excludeKeys={["page"]} />
      <SortMenu />

      {/* 🧩 Danh sách sản phẩm */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <PaginationSection totalPages={totalPages} />
    </div>
  );
}
