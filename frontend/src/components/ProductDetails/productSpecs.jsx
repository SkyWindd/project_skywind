import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function ProductSpecs({ specs = [] }) {
  if (!specs || specs.length === 0) {
    return (
      <Card className="p-4 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          <span>Không có thông số kỹ thuật</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h2 className="font-semibold text-gray-700">Thông số kỹ thuật</h2>
      </div>
      <ul className="text-sm text-gray-600 divide-y">
        {specs.map((item, index) => (
          <li key={index} className="flex justify-between py-1">
            <span className="font-medium">{item.spec_name}</span>
            <span>{item.spec_value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
