import FilterMenu from "@/layout/filtermenu";
import SortMenu from "@/layout/sort";
import FilterTags from "@/layout/filtertags";
import PaginationSection from "@/layout/pagination";
import ProductCard from "@/layout/productcard";
import { useQueryParams } from "@/hooks/useQueryParams";
import products from "@/data/products";

export default function Laptop() {
  const { searchParams } = useQueryParams();
  const page = parseInt(searchParams.get("page") || "1");

  // Giả lập lọc dữ liệu (thực tế có thể fetch API)
  let filtered = [...products];

  const gpu = searchParams.get("gpu");
  const feature = searchParams.get("feature");
  const sort = searchParams.get("sort");

  if (gpu) filtered = filtered.filter((p) => p.gpu === gpu);
  if (feature) filtered = filtered.filter((p) => p.features.includes(feature));

  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

  const perPage = 20;
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <FilterMenu />
      <FilterTags />
      <SortMenu />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <PaginationSection totalPages={totalPages} />
    </div>
  );
}
