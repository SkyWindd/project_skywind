import React, { useState, useEffect } from "react";
import { MapPin, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ProfileAddress() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nguyễn Minh Quân",
      phone: "0918 684 954",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Thị Lan",
      phone: "0902 456 789",
      address: "45 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      isDefault: false,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // ✅ state trung gian

  // 🧩 Thêm hoặc cập nhật
  const handleSave = (formData) => {
    if (editAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editAddress.id ? { ...a, ...formData } : a))
      );
      setToastMessage({
        type: "success",
        text: "✅ Cập nhật địa chỉ thành công!",
        desc: `${formData.name} - ${formData.address}`,
      });
    } else {
      const newId = addresses.length
        ? Math.max(...addresses.map((a) => a.id)) + 1
        : 1;
      const updatedAddresses = formData.isDefault
        ? addresses.map((a) => ({ ...a, isDefault: false }))
        : addresses;

      setAddresses([...updatedAddresses, { id: newId, ...formData }]);
      setToastMessage({
        type: "success",
        text: "🎉 Đã thêm địa chỉ mới!",
        desc: `${formData.name} - ${formData.address}`,
      });
    }

    setModalOpen(false);
    setEditAddress(null);
  };

  const handleEdit = (id) => {
    const target = addresses.find((a) => a.id === id);
    setEditAddress(target);
    setModalOpen(true);
  };

        // 🗑️ Xóa địa chỉ
        const handleDelete = (id) => {
        const deleted = addresses.find((a) => a.id === id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));

        // ✅ Không gọi toast trực tiếp — chỉ set message
        setToastMessage({
            type: "error",
            text: "🗑️ Đã xóa địa chỉ",
            desc: deleted?.name || "Địa chỉ đã bị xóa khỏi danh sách.",
        });
        };

        // ✅ Dùng useEffect để gọi toast sau khi React render xong
        useEffect(() => {
        if (toastMessage) {
            const { type, text, desc } = toastMessage;
            setTimeout(() => {
            if (type === "success") toast.success(text, { description: desc });
            else if (type === "error") toast.error(text, { description: desc });
            }, 0);
            setToastMessage(null);
        }
        }, [toastMessage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-50 shadow-inner ring-1 ring-pink-100">
            <MapPin size={18} className="text-pink-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-pink-700 tracking-tight">
            Địa chỉ giao hàng
          </h3>
        </div>

        <Button
          onClick={() => {
            setEditAddress(null);
            setModalOpen(true);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center py-2 sm:py-2.5 transition-all duration-200"
        >
          <PlusCircle size={16} />
          Thêm địa chỉ
        </Button>
      </div>

      {/* Danh sách địa chỉ */}
      <AnimatePresence>
        {addresses.length > 0 ? (
          <motion.div
            layout
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {addresses.map((addr, index) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                <AddressCard
                  addr={addr}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-10 text-center bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center mb-3 shadow-inner">
                <MapPin className="w-6 h-6 text-pink-500" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base font-medium">
                Bạn chưa thêm địa chỉ giao hàng nào.
            </p>
            <p className="text-gray-400 text-xs mt-1">
                Hãy nhấn nút <span className="font-semibold text-pink-600">"Thêm địa chỉ"</span> ở trên để bắt đầu.
            </p>
            </Card>
        )}
      </AnimatePresence>

      {/* Modal thêm / sửa địa chỉ */}
      <AddressFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditAddress(null);
        }}
        onSubmit={handleSave}
        initialData={editAddress}
      />
    </div>
  );
}
