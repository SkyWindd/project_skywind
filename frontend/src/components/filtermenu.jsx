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
import { Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";

const filtersConfig = {
  price: {
    label: "Giá",
    options: ["Dưới 15 triệu", "15 - 20 triệu", "20 - 25 triệu", "Trên 25 triệu"],
  },
  brand: { label: "Hãng", options: ["Asus", "Acer", "MSI", "Lenovo", "HP", "Dell"] },
  cpu: { label: "CPU", options: ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"] },
  ram: { label: "RAM", options: ["8GB", "16GB", "32GB"] },
  ssd: { label: "SSD", options: ["256GB", "512GB", "1TB"] },
  vga: { label: "Card đồ họa", options: ["Card Onboard", "RTX 3050", "RTX 3060", "RTX 4050", "RTX 4060"] },
};

export default function FilterMenu() {
  const { searchParams, setParam, removeParam } = useQueryParams();
  const [openPopover, setOpenPopover] = useState(null);

  const getSelected = (key) => searchParams.getAll(key);

  // 🧩 Xử lý chọn/bỏ chọn filter
  const handleToggle = (key, value) => {
    const current = getSelected(key);
    let updated;

    if (current.includes(value)) {
      updated = current.filter((v) => v !== value);
    } else {
      updated = [...current, value];
    }

    // 🔹 Cập nhật param
    if (updated.length === 0) {
      removeParam(key);
    } else {
      setParam(key, updated);
    }

    // --- Xử lý riêng phần giá ---
    if (key === "price") {
      const selectedPrices = updated;

      if (!selectedPrices || selectedPrices.length === 0) {
        removeParam("min_price");
        removeParam("max_price");
        return;
      }

      const priceRanges = selectedPrices
        .map((price) => {
          switch (price) {
            case "Dưới 15 triệu":
              return { min: 0, max: 15000000 };
            case "15 - 20 triệu":
              return { min: 15000000, max: 20000000 };
            case "20 - 25 triệu":
              return { min: 20000000, max: 25000000 };
            case "Trên 25 triệu":
              return { min: 25000000, max: Infinity };
            default:
              return null;
          }
        })
        .filter(Boolean);

      const minPrice = Math.min(...priceRanges.map((p) => p.min));
      const maxPriceRaw = Math.max(...priceRanges.map((p) => p.max));

      if (maxPriceRaw === Infinity) {
        setParam("min_price", minPrice.toString());
        removeParam("max_price");
      } else {
        setParam("min_price", minPrice.toString());
        setParam("max_price", maxPriceRaw.toString());
      }
    }

    // ✅ Xử lý riêng phần "Còn hàng / Hết hàng"
    if (key === "in_stock") {
      if (updated.includes("Còn hàng")) {
        setParam("in_stock", "true");
      } else if (updated.includes("Hết hàng")) {
        setParam("in_stock", "false");
      } else {
        removeParam("in_stock");
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold mb-3">Chọn theo tiêu chí</h2>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          <Filter size={16} className="mr-1" />
          Bộ lọc
        </Button>

        {/* ✅ Dropdown "Kho hàng" */}
        <Popover
          open={openPopover === "in_stock"}
          onOpenChange={() =>
            setOpenPopover(openPopover === "in_stock" ? null : "in_stock")
          }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`rounded-lg bg-gray-100 hover:bg-gray-200 ${
                getSelected("in_stock").includes("Còn hàng")
                  ? "text-green-700 border-green-500 bg-green-100"
                  : ""
              }`}
            >
              {getSelected("in_stock").includes("Còn hàng")
                ? "✅ Còn hàng"
                : "Tình trạng "}
              <ChevronDown size={14} className="ml-2 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <Command>
              <CommandInput placeholder="Tìm trạng thái..." />
              <CommandList>
                <CommandGroup>
                  {["Còn hàng"].map((opt) => (
                    <CommandItem
                      key={opt}
                      onSelect={() => handleToggle("in_stock", opt)}
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      <Checkbox checked={getSelected("in_stock").includes(opt)} />
                      {opt}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Các bộ lọc còn lại */}
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
                className="rounded-lg bg-gray-100 hover:bg-gray-200"
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
                        className="flex gap-2 items-center cursor-pointer"
                      >
                        <Checkbox checked={getSelected(key).includes(opt)} />
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
    </div>
  );
}
