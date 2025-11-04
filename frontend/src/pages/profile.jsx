import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">
          ⚠️ Bạn cần đăng nhập để xem thông tin cá nhân.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
          <span role="img" aria-label="profile">
            👤
          </span>{" "}
          Thông tin cá nhân
        </h2>

        <div className="space-y-4 text-gray-800">
          <div>
            <p className="font-medium">Tên đăng nhập:</p>
            <p>{user.username || "Chưa có"}</p>
          </div>

          <div>
            <p className="font-medium">Email:</p>
            <p>{user.email || "Không có email"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
