import { useQueryParams } from "@/hooks/useQueryParams";
import { Star, Flame, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";

export default function SortMenu() {
  const { setParam, searchParams } = useQueryParams();
  const sort = searchParams.get("sort") || "";

  const handleSort = (value) => setParam("sort", value);

  const sortOptions = [
    { key: "popular", label: "Phổ biến", icon: <Star size={16} /> },
    { key: "hot", label: "Khuyến mãi HOT", icon: <Flame size={16} /> },
    { key: "low-high", label: "Giá Thấp - Cao", icon: <ArrowDownWideNarrow size={16} /> },
    { key: "high-low", label: "Giá Cao - Thấp", icon: <ArrowUpWideNarrow size={16} /> },
  ];

  return (
    <div className="border rounded-lg p-4 bg-white mt-4">
      <div className="flex items-center justify-between">
        {/* Title bên trái */}
        <h2 className="text-lg font-semibold whitespace-nowrap mr-4">
          Sắp xếp theo
        </h2>

        {/* Buttons bên phải */}
        <div className="flex flex-wrap gap-3">
          {sortOptions.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSort(item.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
                sort === item.key
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
