import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function FilterTags() {
  const { searchParams, removeParam, clearAll } = useQueryParams();

  const entries = Array.from(searchParams.entries());
  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
        >
          {key}: {value}
          <button
            onClick={() => removeParam(key)}
            className="ml-1 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={clearAll}>
        Bỏ chọn tất cả
      </Button>
    </div>
  );
}
