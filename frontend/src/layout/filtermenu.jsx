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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { useQueryParams } from "@/hooks/useQueryParams";

const filtersConfig = {
  status: {
    label: "Tình trạng",
    options: ["Mới 100%", "Like New", "Cũ"],
  },
  price: {
    label: "Giá",
    options: ["Dưới 15 triệu", "15 - 20 triệu", "20 - 25 triệu", "Trên 25 triệu"],
  },
  brand: {
    label: "Hãng",
    options: ["ASUS", "Acer", "MSI", "Lenovo", "HP", "Dell"],
  },
  cpu: {
    label: "CPU",
    options: ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"],
  },
  ram: {
    label: "RAM",
    options: ["8GB", "16GB", "32GB"],
  },
  ssd: {
    label: "SSD",
    options: ["256GB", "512GB", "1TB"],
  },
  vga: {
    label: "Card đồ họa",
    options: ["RTX 2050", "RTX 3050", "RTX 4050", "RTX 4060"],
  },
};

export default function FilterMenu() {
  const { searchParams, setParam, removeParam, clearAllParams } = useQueryParams();
  const [openPopover, setOpenPopover] = useState(null);

  // Chuyển chuỗi query -> mảng
  const getSelected = (key) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const handleToggle = (key, value) => {
    const current = getSelected(key);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setParam(key, updated.join(","));
  };

  // Tổng hợp các filter đang chọn
  const activeFilters = Object.entries(filtersConfig)
    .map(([key, { label }]) => ({
      key,
      label,
      values: getSelected(key),
    }))
    .filter((f) => f.values.length > 0);

  return (
    <div className="w-full bg-white shadow-sm rounded-xl p-4 space-y-3">
      {/* Hàng bộ lọc */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Filter size={16} />
          Bộ lọc
        </Button>

        {Object.entries(filtersConfig).map(([key, { label, options }]) => (
          <Popover
            key={key}
            open={openPopover === key}
            onOpenChange={() => setOpenPopover(openPopover === key ? null : key)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 min-w-[130px] justify-between"
              >
                {label}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[220px] p-0">
              <Command>
                <CommandInput placeholder={`Tìm ${label.toLowerCase()}...`} />
                <CommandList>
                  <CommandGroup>
                    {options.map((opt) => {
                      const selected = getSelected(key).includes(opt);
                      return (
                        <CommandItem
                          key={opt}
                          onSelect={() => handleToggle(key, opt)}
                          className="flex items-center gap-2"
                        >
                          <Checkbox checked={selected} />
                          <span>{opt}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {/* Hàng hiển thị các filter đã chọn */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {activeFilters.map(({ key, values }) =>
            values.map((value) => (
              <Badge
                key={`${key}-${value}`}
                variant="secondary"
                className="flex items-center gap-1 text-blue-600 border border-blue-600"
              >
                {value}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => handleToggle(key, value)}
                />
              </Badge>
            ))
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllParams}
            className="text-red-500 hover:text-red-700"
          >
            Bỏ chọn tất cả
          </Button>
        </div>
      )}
    </div>
  );
}
