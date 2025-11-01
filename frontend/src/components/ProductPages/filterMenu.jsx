import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {Filter} from "lucide-react";
const filtersConfig = {
  price: {
    label: "Giá",
    options: ["Dưới 15 triệu", "15 - 20 triệu", "20 - 25 triệu", "Trên 25 triệu"],
  },
  brand: { label: "Hãng", options: ["Asus", "Acer", "MSI", "Lenovo", "HP", "Dell"] },
  cpu: { label: "CPU", options: ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"] },
  ram: { label: "RAM", options: ["8GB", "16GB", "32GB"] },
  ssd: { label: "SSD", options: ["256GB", "512GB", "1TB"] },
  vga: { label: "Card đồ họa", options: ["RTX 3050", "RTX 3060", "RTX 4050", "RTX 4060"] },
};

export default function FilterMenu() {
  const { searchParams, setParam, removeParam } = useQueryParams();
  const [openPopover, setOpenPopover] = useState(null);
  const [openMobile, setOpenMobile] = useState(false);

  // ✅ Parse chuỗi "Asus,Acer" => ["Asus", "Acer"]
  const parseValues = (str) =>
    str ? decodeURIComponent(str).split(",").map((v) => v.trim()) : [];

  // ✅ Local state lưu filter hiện tại (từ URL)
  const [currentFilters, setCurrentFilters] = useState({});
  // ✅ Local state lưu filter tạm (người dùng chọn)
  const [tempFilters, setTempFilters] = useState({});

  // ✅ Khi URL thay đổi → đồng bộ filter hiện tại
  useEffect(() => {
    const synced = {};
    Object.keys(filtersConfig).forEach((key) => {
      const val = searchParams.get(key);
      synced[key] = val ? parseValues(val) : [];
    });
    setCurrentFilters(synced);
    setTempFilters(synced); // reset filter tạm mỗi lần URL đổi
  }, [searchParams.toString()]);

  // ✅ Tính tổng số filter đã chọn (trong temp)
  const totalSelected = useMemo(() => {
    if (!tempFilters || typeof tempFilters !== "object") return 0;
    return Object.values(tempFilters).reduce(
      (count, arr) => count + (arr?.length || 0),
      0
    );
  }, [tempFilters]);

  // ✅ Toggle filter (chỉ lưu tạm, chưa gửi URL)
  const handleToggle = (key, value) => {
    setTempFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  // ✅ Kiểm tra đã chọn
  const isSelected = (key, value) => tempFilters[key]?.includes(value);

  // ✅ Xóa tất cả filter
  const clearAll = () => {
  // 1️⃣ Reset state tạm thời
  setTempFilters({});

  // 2️⃣ Xóa hết các tham số filter trên URL
  Object.keys(filtersConfig).forEach((key) => {
    removeParam(key);
  });

  // 3️⃣ Đảm bảo đồng bộ lại state chính
  setCurrentFilters({});
};

  // ✅ Áp dụng filter: cập nhật URL thật (khi bấm “Áp dụng”)
  const applyFilters = () => {
    Object.entries(tempFilters).forEach(([key, values]) => {
      if (!values.length) removeParam(key);
      else setParam(key, values.join(","));
    });
  };

  // ✅ Nút render option
  const renderOption = (key, opt) => {
    const active = isSelected(key, opt);
    return (
      <Button
        key={opt}
        variant="outline"
        onClick={() => handleToggle(key, opt)}
        className={`text-sm border transition-all duration-150 ${
          active
            ? "border-blue-600 bg-blue-100 text-blue-700 font-semibold shadow-sm"
            : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
        }`}
      >
        {opt}
      </Button>
    );
  };

  return (
    <>
      {/* 💻 Desktop */}
      <div className="hidden lg:block border rounded-lg p-4 bg-white">
        <h2 className="text-lg font-semibold mb-3">Chọn theo tiêu chí</h2>

        <div className="flex flex-wrap gap-3 items-start justify-between">
          <div className="flex flex-wrap gap-3 flex-grow">
            {Object.entries(filtersConfig).map(([key, { label, options }]) => (
              <Popover
                key={key}
                open={openPopover === key}
                onOpenChange={() =>
                  setOpenPopover(openPopover === key ? null : key)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`rounded-lg hover:bg-gray-100 transition-colors ${
                      (tempFilters[key]?.length || 0) > 0
                        ? "border-blue-500 bg-blue-100 text-blue-700"
                        : "bg-gray-50 text-gray-800"
                    }`}
                  >
                    {label}
                    <ChevronDown size={14} className="ml-2 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <Command>
                    <CommandInput placeholder={`Tìm ${label.toLowerCase()}...`} />
                    <CommandList>
                      <CommandGroup>
                        {options.map((opt) => (
                          <CommandItem
                            key={opt}
                            onSelect={() => handleToggle(key, opt)}
                            className={`flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 ${
                              isSelected(key, opt)
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <Checkbox checked={isSelected(key, opt)} />
                            {opt}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ))}
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 ml-auto">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={applyFilters}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile */}
      <div className="block lg:hidden mt-3">
        <button
      onClick={() => setOpenMobile(true)}
      className="relative flex items-center gap-1 text-red-500 border border-red-500 font-semibold text-[13px] px-3 py-1.5 rounded-lg active:scale-[0.97] transition select-none"
    >
      <Filter size={16} strokeWidth={2} />
      <span className="leading-none">Bộ lọc</span>

      {/* Badge đỏ nhỏ */}
      {totalSelected > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
          {totalSelected}
        </span>
      )}
    </button>
      </div>

      {/* 📱 Mobile Sheet */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="bottom"
          className="p-4 rounded-t-xl h-[90vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-semibold">
              Bộ lọc sản phẩm
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => setOpenMobile(false)}
            >
              <X size={18} />
            </Button>
          </SheetHeader>

          <div className="mt-6 space-y-6 pb-28">
            {Object.entries(filtersConfig).map(([key, { label, options }]) => (
              <div key={key}>
                <h3
                  className={`font-medium mb-2 ${
                    tempFilters[key]?.length > 0
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  {label}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {options.map((opt) => renderOption(key, opt))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer nút hành động */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3 px-4 flex justify-between gap-3 z-50">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={clearAll}
            >
              Xóa tất cả
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                applyFilters();
                setOpenMobile(false);
              }}
            >
              Áp dụng
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
