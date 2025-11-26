import React from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AddressCard({ addr, onEdit, onDelete }) {
  return (
    <Card className="p-5 border border-gray-200 shadow-sm rounded-xl">
      <div className="flex flex-col gap-2">

        {/* Tên */}
        <div className="flex items-center gap-2 font-semibold text-lg text-pink-700">
          <MapPin size={18} />
          {addr.name}
        </div>

        {/* Số điện thoại */}
        <div className="text-gray-600 text-sm">
          {addr.phone}
        </div>

        {/* Địa chỉ đầy đủ */}
        <div className="text-gray-700 text-sm leading-relaxed">
          {addr.street && <div>Số nhà: {addr.street}</div>}
          {addr.ward && <div>Phường / Xã: {addr.ward}</div>}
          {addr.district && <div>Quận / Huyện: {addr.district}</div>}
          {addr.province && <div>Tỉnh / Thành phố: {addr.province}</div>}
        </div>

        {/* Mặc định */}
        {addr.is_default && (
          <div className="mt-1 inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
            Địa chỉ mặc định
          </div>
        )}

        {/* Nút */}
        <div className="flex gap-3 mt-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onEdit(addr.id)}
          >
            <Pencil size={16} />
            Cập nhật
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => onDelete(addr.id)}
          >
            <Trash2 size={16} />
            Xóa
          </Button>
        </div>
      </div>
    </Card>
  );
}
