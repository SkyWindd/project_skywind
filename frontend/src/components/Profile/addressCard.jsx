import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function AddressCard({ addr, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      {/* Card địa chỉ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="p-4 sm:p-5 border border-gray-100 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-300">
          {/* Thông tin chính */}
          <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
            <div className="flex-1 min-w-[200px]">
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg flex items-center gap-1">
                <MapPin size={15} className="text-pink-500" />
                {addr.name}
              </h4>
              <p className="text-gray-600 text-sm mt-1">{addr.phone}</p>
              <p className="text-gray-500 text-sm mt-1 leading-snug break-words">
                {addr.address}
              </p>
            </div>

            {addr.isDefault && (
              <Badge className="bg-pink-100 text-pink-600 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap shadow-inner">
                Mặc định
              </Badge>
            )}
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(addr.id)}
              className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-1 text-gray-700 border-gray-200 hover:bg-gray-100 active:scale-[0.98] transition"
            >
              <Pencil size={14} />
              Cập nhật
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-1 text-red-600 border-red-200 hover:bg-red-50 active:scale-[0.98] transition"
            >
              <Trash2 size={14} />
              Xóa
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Dialog xác nhận xóa */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Xác nhận xóa
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa địa
              chỉ này?
            </DialogDescription>
          </DialogHeader>

          <p className="text-gray-600 text-sm mb-5 mt-2">
            Địa chỉ:{" "}
            <span className="font-medium text-gray-800">{addr.address}</span>
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => setConfirmDelete(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                onDelete(addr.id);
                setConfirmDelete(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
