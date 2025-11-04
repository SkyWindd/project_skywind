import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function ProductSpecsTable({ specs }) {
  if (!specs || specs.length === 0)
    return (
      <Card className="p-4 text-gray-500 italic text-center">
        Không có thông số kỹ thuật
      </Card>
    );

  return (
    <Card className="p-4 border border-gray-200 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Thông số kỹ thuật
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[35%] text-gray-700 font-semibold">
              Thông số
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              Chi tiết
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {specs.map((item, i) => (
            <TableRow
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <TableCell className="font-medium text-gray-700">
                {item.spec_name}
              </TableCell>
              <TableCell className="text-gray-600 whitespace-pre-line">
                {item.spec_value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
