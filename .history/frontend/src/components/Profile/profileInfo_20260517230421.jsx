import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProfileInfo({ user }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ username: "", email: "" });

  useEffect(() => {
    if (user) {
      setEditData({ username: user.username, email: user.email });
    }
  }, [user]);

const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/users/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (!res.ok) throw new Error("Cập nhật thất bại");

      alert("Cập nhật thành công!");
      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className="w-full">
      {/* Card chính */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 text-center sm:text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center sm:items-start gap-4 mx-auto sm:mx-0 group transition-all duration-300">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 ring-1 ring-purple-200 shadow-inner group-hover:shadow-md transition-all duration-300">
                <User className="w-6 h-6 text-purple-700 group-hover:scale-110 transition-transform duration-200" />
            </div>

            {/* Text section */}
            <div className="flex flex-col justify-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                Thông tin cá nhân
                </h2>

                {/* Mô tả trên desktop */}
                <p className="hidden sm:block text-gray-500 text-sm mt-1 tracking-tight">
                Quản lý và cập nhật thông tin của bạn
                </p>

                {/* Mô tả rút gọn trên mobile */}
                <p className="sm:hidden text-gray-500 text-xs mt-1 tracking-tight">
                Cập nhật thông tin cá nhân
                </p>
            </div>
            </div>


          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-purple-50 hover:text-purple-700 transition"
          >
            <Pencil size={14} /> Cập nhật
          </Button>
        </div>

        <Separator className="mb-5" />

        {/* Nội dung */}
        <div className="space-y-5 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Tên đăng nhập</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{user.username}</span>
            </div>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Email</p>
            <p className="font-medium text-gray-900 break-all">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              ✏️ Cập nhật thông tin cá nhân
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Thay đổi thông tin của bạn bên dưới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
                placeholder="Nhập tên mới của bạn"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                placeholder="Nhập email mới"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
