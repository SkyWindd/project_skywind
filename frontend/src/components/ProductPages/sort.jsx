import { useQueryParams } from "@/hooks/useQueryParams";
import {
  Star,
  Flame,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SortMenu() {
  const { setParam, searchParams } = useQueryParams();
  const sort = searchParams.get("sort") || "";

  const handleSort = (value) => setParam("sort", value);

  const sortOptions = [
    { key: "popular", label: "Phổ biến", icon: <Star size={16} /> },
    { key: "hot", label: "Khuyến mãi HOT", icon: <Flame size={16} /> },
    { key: "low-high", label: "Giá Thấp - Cao", icon: <ArrowDownWideNarrow size={16} /> },
    { key: "high-low", label: "Giá Cao - Thấp", icon: <ArrowUpWideNarrow size={16} /> },
    { key: "name-asc", label: "Tên A → Z" },
    { key: "name-desc", label: "Tên Z → A" },
  ];

  const currentLabel =
    sortOptions.find((opt) => opt.key === sort)?.label || "Sắp xếp";

  return (
    <>
      {/* 💻 DESKTOP layout - giữ nguyên */}
      <div className="hidden lg:block border rounded-lg p-4 bg-white mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold whitespace-nowrap mr-4">
            Sắp xếp theo
          </h2>
          <div className="flex flex-wrap gap-3">
            {sortOptions.map(
              (item) =>
                item.icon && (
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
                )
            )}
          </div>
        </div>
      </div>

      {/* 📱 MOBILE layout - chuyển sang dropdown của shadcn */}
      <div className="lg:hidden flex items-center gap-2 bg-transparent mt-3">
       {/* DropdownMenu tinh gọn cho mobile */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center justify-between gap-1 text-[13px] font-medium text-gray-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 active:scale-[0.98] transition min-w-[130px]">
      <span className="truncate max-w-[90px] text-ellipsis">{currentLabel}</span>
      <ChevronDown size={14} className="opacity-60" />
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={4}
    className="w-[170px] bg-white border border-gray-200 rounded-md shadow-md py-1"
  >
    {sortOptions.map((opt) => (
      <DropdownMenuItem
        key={opt.key}
        onClick={() =>
          handleSort({ target: { value: opt.key } }.target.value)
        }
        className={`flex items-center gap-2 text-[13px] cursor-pointer px-3 py-1.5 transition ${
          sort === opt.key
            ? "text-blue-600 font-semibold bg-blue-50"
            : "hover:bg-gray-50"
        }`}
      >
        {opt.icon && <span className="w-4 h-4 text-gray-500">{opt.icon}</span>}
        <span>{opt.label}</span>
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>

      </div>
    </>
  );
}
