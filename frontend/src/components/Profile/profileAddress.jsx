import React, { useState, useEffect } from "react";
import { MapPin, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddressCard from "./addressCard";
import AddressFormModal from "./addressFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";

export default function ProfileAddress() {
  const { user } = useAuth();

  const userId = user?.id || user?.user_id;

  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  // =============================================
  // 🟦 LOAD ADDRESS
  // =============================================
  const loadAddresses = async () => {
    try {
      if (!userId) return;

      const res = await axiosClient.get(
        `/users/api/address/user/${userId}`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setAddresses(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Không thể tải danh sách địa chỉ"
      );
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  // =============================================
  // 🟧 SAVE ADDRESS
  // =============================================
  const handleSave = async (formData) => {
    try {
      await axiosClient.post(
        "/users/api/address/save",
        {
          user_id: userId,
          ...formData,
        }
      );

      toast.success(
        editAddress
          ? "Cập nhật địa chỉ thành công!"
          : "Thêm địa chỉ thành công!"
      );

      setModalOpen(false);
      setEditAddress(null);

      loadAddresses();
    } catch (error) {
      console.error(error);

      toast.error("Lỗi lưu địa chỉ!");
    }
  };

  // =============================================
  // 🟨 EDIT
  // =============================================
  const handleEdit = (id) => {
    const selected = addresses.find(
      (a) => a.id === id
    );

    setEditAddress(selected);

    setModalOpen(true);
  };

  // =============================================
  // 🟥 DELETE
  // =============================================
  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(
        `/users/api/address/delete/${id}`
      );

      toast.success("Xóa địa chỉ thành công");

      loadAddresses();
    } catch (error) {
      console.error(error);

      toast.error("Không thể xóa địa chỉ");
    }
  };

  // =============================================
  // ❌ CHƯA LOGIN
  // =============================================
  if (!userId) {
    return (
      <div className="text-center py-10 text-gray-500">
        Vui lòng đăng nhập
      </div>
    );
  }

  // =============================================
  // 🟦 UI
  // =============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-pink-50 rounded-xl">
            <MapPin
              className="text-pink-600"
              size={20}
            />
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
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
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
          <Card className="p-10 text-center">
            <p className="text-gray-500">
              Bạn chưa có địa chỉ giao hàng.
            </p>
          </Card>
        )}
      </AnimatePresence>

      {/* Modal */}
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