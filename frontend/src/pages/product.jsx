import { useEffect, useState, useMemo } from "react";
import { Filter } from "lucide-react";
import FilterMenu from "@/components/ProductPages/filterMenu";
import SortMenu from "@/components/ProductPages/sort";
import FilterTags from "@/components/ProductPages/filterTags";
import PaginationSection from "@/components/ProductPages/pagination";
import ProductCard from "@/components/Product/productcard";
import { useQueryParams } from "@/hooks/useQueryParams";
import productApi from "@/api/productApi";

export default function Product() {
  const { searchParams } = useQueryParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false); // ✅ để điều khiển FilterMenu ở mobile

  // 🧩 Gom tất cả filter trừ "page"
  const getFilters = () => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "page" && value) obj[key] = value;
    }
    return obj;
  };

  const [filters, setFilters] = useState(getFilters());

  // 🔄 Cập nhật filters khi URL thay đổi (ngoại trừ page)
  useEffect(() => {
    const newFilters = getFilters();
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
  }, [searchParams.toString()]);

  // 🧮 Đếm số bộ lọc đang chọn
  const totalSelected = useMemo(() => Object.keys(filters).length, [filters]);

  // 🧠 Chỉ gọi API khi filters thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("🔍 Gửi bộ lọc:", filters);
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
  }, [JSON.stringify(filters)]);

  // --- Sắp xếp ---
  const sort = searchParams.get("sort");
  let filtered = [...products];
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

  // --- Phân trang ---
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 20;
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-10 animate-pulse">
        Đang tải sản phẩm...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 📱 MOBILE: Thanh lọc + sắp xếp ngang */}
      <div className="lg:hidden flex items-center justify-between border rounded-lg bg-white px-4 py-2 sticky top-0 z-40">
       <FilterMenu openMobile={openFilter} setOpenMobile={setOpenFilter} />

        <span className="text-gray-400">|</span>

        {/* Sort dropdown (giữ nguyên logic SortMenu) */}
        <div className="flex items-center gap-2 text-gray-800 font-medium">
          <SortMenu />
        </div>
      </div>

      {/* 💻 DESKTOP layout */}
      <div className="hidden lg:block">
        <FilterMenu openMobile={openFilter} setOpenMobile={setOpenFilter} />
        <FilterTags excludeKeys={["page"]} />
        <SortMenu />
      </div>

      {/* 🧩 Danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <PaginationSection totalPages={totalPages} />
    </div>
  );
}
