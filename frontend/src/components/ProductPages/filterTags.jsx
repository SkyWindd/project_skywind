import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function FilterTags({ excludeKeys = [] }) {
  const { searchParams, removeParam, clearAll } = useQueryParams();

  // chuyển entries thành mảng, bỏ keys bị exclude
  const entries = Array.from(searchParams.entries()).filter(
    ([key]) => !excludeKeys.includes(key)
  );

  if (!entries.length) return null;

  // helper: nếu giá trị chứa dấu phẩy -> tách, decode từng phần
  const parseValueList = (raw) => {
    if (!raw) return [];
    // raw may be encoded in URL; decode then split by comma
    try {
      const decoded = decodeURIComponent(raw);
      return decoded.split(",").map((v) => v.trim()).filter(Boolean);
    } catch (e) {
      // fallback
      return raw.split(",").map((v) => v.trim()).filter(Boolean);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white mt-4">
      <h2 className="text-lg font-semibold mb-3">Đang lọc theo</h2>

      <div className="flex flex-wrap gap-2 items-center">
        {entries.map(([key, rawValue]) => {
          const values = parseValueList(rawValue);

          // hiển thị dạng: "Brand: Asus, Acer" (hoặc từng badge riêng nếu bạn muốn)
          return (
            <div
              key={key}
              className="flex items-center gap-2 bg-white border shadow-sm px-3 py-1 rounded-lg text-sm"
            >
              <span className="font-medium capitalize mr-1">{key}:</span>

              {/* nếu nhiều giá trị, hiển thị nối bằng dấu phẩy */}
              <span className="mr-2">
                {values.length > 0 ? values.join(", ") : rawValue}
              </span>

              <button
                onClick={() => removeParam(key)}
                className="hover:text-red-600"
                aria-label={`Xóa lọc ${key}`}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        <Button variant="link" onClick={clearAll} className="text-blue-600">
          Bỏ chọn tất cả
        </Button>
      </div>
    </div>
  );
}
