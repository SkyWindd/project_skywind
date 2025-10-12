import { useQueryParams } from "@/hooks/useQueryParams";
import { Button } from "@/components/ui/button";

export default function SortMenu() {
  const { setParam, searchParams } = useQueryParams();
  const sort = searchParams.get("sort") || "";

  const handleSort = (value) => setParam("sort", value);

  return (
    <div className="flex flex-wrap gap-3 mt-5 mb-3">
      <Button
        variant={sort === "popular" ? "default" : "outline"}
        onClick={() => handleSort("popular")}
      >
        Phổ biến
      </Button>
      <Button
        variant={sort === "low-high" ? "default" : "outline"}
        onClick={() => handleSort("low-high")}
      >
        Giá thấp - cao
      </Button>
      <Button
        variant={sort === "high-low" ? "default" : "outline"}
        onClick={() => handleSort("high-low")}
      >
        Giá cao - thấp
      </Button>
    </div>
  );
}
