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
  status: { label: "Tình trạng", options: ["Sẵn hàng", "Like New", "Cũ"] },
  price: { label: "Giá", options: ["Dưới 15 triệu", "15 - 20 triệu", "20 - 25 triệu", "Trên 25 triệu"] },
  brand: { label: "Hãng", options: ["ASUS", "Acer", "MSI", "Lenovo", "HP", "Dell"] },
  cpu: { label: "CPU", options: ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"] },
  ram: { label: "RAM", options: ["8GB", "16GB", "32GB"] },
  ssd: { label: "SSD", options: ["256GB", "512GB", "1TB"] },
  vga: { label: "Card đồ họa", options: ["Card Onboard", "RTX 3050", "RTX3060", "RTX 4050", "RTX 4060"] },
};

export default function FilterMenu() {
  const { searchParams, setParam } = useQueryParams();
  const [openPopover, setOpenPopover] = useState(null);

  const getSelected = (key) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const handleToggle = (key, value) => {
    const current = getSelected(key);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setParam(key, updated.join(","));
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

        {Object.entries(filtersConfig).map(([key, { label, options }]) => (
          <Popover
            key={key}
            open={openPopover === key}
            onOpenChange={() => setOpenPopover(openPopover === key ? null : key)}
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
