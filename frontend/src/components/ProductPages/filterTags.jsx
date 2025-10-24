import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function FilterTags({ excludeKeys = [] }) {
  const { searchParams, removeParam, clearAll } = useQueryParams();

  // 🧩 Lọc bỏ những key không muốn hiển thị (như "page")
  const entries = Array.from(searchParams.entries()).filter(
    ([key]) => !excludeKeys.includes(key)
  );

  if (!entries.length) return null;

  return (
    <div className="border rounded-lg p-4 bg-white mt-4">
      <h2 className="text-lg font-semibold mb-3">Đang lọc theo</h2>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-2 bg-white border shadow-sm px-3 py-1 rounded-lg text-sm"
          >
            <span className="font-medium capitalize">{key}:</span>
            {value}
            <button
              onClick={() => removeParam(key)}
              className="hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <Button variant="link" onClick={clearAll} className="text-blue-600">
          Bỏ chọn tất cả
        </Button>
      </div>
    </div>
  );
}
