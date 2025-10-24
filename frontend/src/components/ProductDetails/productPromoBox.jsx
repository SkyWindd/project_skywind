import React from "react";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ProductPromoBox({ promos }) {
  return (
    <Card className="border border-red-100 bg-red-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="text-red-600 w-5 h-5" />
        <h3 className="text-red-600 font-semibold">Quà tặng khuyến mãi</h3>
      </div>
      <ul className="list-decimal pl-6 text-sm text-gray-700 space-y-1">
        {promos.map((p, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </ul>
      <div className="mt-3 text-sm font-medium text-gray-600 flex items-center gap-2">
        🎓 Laptop mua 1 tặng 5 • Ưu đãi HSSV
        <span className="text-blue-600 cursor-pointer">Chi tiết</span>
      </div>
    </Card>
  );
}
