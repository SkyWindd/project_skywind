import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function ProductSpecs({ specs }) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h2 className="font-semibold text-gray-700">Thông tin cấu hình</h2>
      </div>
      <ul className="text-sm text-gray-600 space-y-1">
        {Object.entries(specs).map(([key, value]) => (
          <li key={key} className="flex justify-between border-b py-1">
            <span className="font-medium">{key}:</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
