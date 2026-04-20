import React, { useState, useEffect } from "react";
import { MapPin, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddressCard from "./addressCard";
import AddressFormModal from "./addressFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ProfileAddress() {
  const userId = 1; // TODO: lấy từ JWT sau

  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // =============================================
  // 🟦 Load address từ DB
  // =============================================
  const loadAddresses = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/address/user/${userId}`);
      const data = await res.json();
      setAddresses(data);
    } catch (error) {
      toast.error("Không thể tải danh sách địa chỉ");
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // =============================================
  // 🟧 Save address (create hoặc update)
  // =============================================
  const handleSave = async (formData) => {
    try {
      await fetch("http://localhost:5000/api/address/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ...formData,
        }),
      });

      setToastMessage({
        type: "success",
        text: editAddress ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ thành công!",
        desc: `${formData.street}, ${formData.ward}`,
      });

      setModalOpen(false);
      setEditAddress(null);
      loadAddresses();
    } catch (error) {
      toast.error("Lỗi lưu địa chỉ!");
    }
  };

  // =============================================
  // 🟨 Edit address
  // =============================================
  const handleEdit = (id) => {
    const selected = addresses.find((a) => a.id === id);
    setEditAddress(selected);
    setModalOpen(true);
  };

  // =============================================
  // 🟥 Delete address
  // =============================================
  const handleDelete = async (id) => {
    const deleted = addresses.find((a) => a.id === id);

    try {
      await fetch(`http://localhost:5000/api/address/delete/${id}`, {
        method: "DELETE",
      });

      setToastMessage({
        type: "error",
        text: "Xóa địa chỉ thành công",
        desc: deleted?.street,
      });

      loadAddresses();
    } catch (error) {
      toast.error("Không thể xóa địa chỉ");
    }
  };

  // =============================================
  // 🟩 Tự động show toast khi set toastMessage
  // =============================================
  useEffect(() => {
    if (toastMessage) {
      const { type, text, desc } = toastMessage;

      setTimeout(() => {
        type === "success"
          ? toast.success(text, { description: desc })
          : toast.error(text, { description: desc });
      }, 0);

      setToastMessage(null);
    }
  }, [toastMessage]);

  // =============================================
  // 🟦 UI
  // =============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-pink-50 rounded-xl">
            <MapPin className="text-pink-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-pink-700">
            Địa chỉ giao hàng
          </h3>
        </div>

        <Button
          onClick={() => {
            setEditAddress(null);
            setModalOpen(true);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          <PlusCircle size={18} />
          Thêm địa chỉ
        </Button>
      </div>

      {/* List */}
      <AnimatePresence>
        {addresses.length > 0 ? (
          <motion.div className="flex flex-col gap-4">
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
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
          <Card className="p-10 text-center">
            <p className="text-gray-500">Bạn chưa có địa chỉ giao hàng.</p>
          </Card>
        )}
      </AnimatePresence>

      {/* Modal Add / Edit */}
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
