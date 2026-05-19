import React, { useEffect, useState } from "react";

import axios from "axios";

import {
  Edit,
  Trash2,
  Lock,
  Unlock,
  UserPlus,
  Users,
} from "lucide-react";

import { toast } from "sonner";

const API_URL =
  "http://localhost:8000/users/api/users";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // FETCH USERS
  // =========================================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        API_URL
      );

      setUsers(response.data || []);
    } catch (error) {
      console.error(
        "FETCH USERS ERROR:",
        error
      );

      toast.error(
        "Không thể tải danh sách user ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================================
  // DELETE USER
  // =========================================
  const deleteUser = async (
    userId
  ) => {
    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa tài khoản này không?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/${userId}`
      );

      setUsers((prev) =>
        prev.filter(
          (u) => u.user_id !== userId
        )
      );

      toast.success(
        "Xóa tài khoản thành công ✅"
      );
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      toast.error(
        "Không thể xóa tài khoản ❌"
      );
    }
  };

  // =========================================
  // LOCK / UNLOCK USER
  // =========================================
  const toggleActive = async (
    user
  ) => {
    try {
      const currentLocked =
        user.is_active === false ||
        user.is_active ===
          "false" ||
        user.is_active === 0;

      const updatedUser = {
        username: user.username,
        email: user.email,
        role: user.role,

        // ===== ĐẢO TRẠNG THÁI =====
        is_active:
          currentLocked,
      };

      await axios.put(
        `${API_URL}/${user.user_id}`,
        updatedUser
      );

      // =========================================
      // UPDATE UI NGAY
      // =========================================
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id ===
          user.user_id
            ? {
                ...u,
                is_active:
                  !currentLocked,
              }
            : u
        )
      );

      toast.success(
        currentLocked
          ? "Đã mở khóa tài khoản ✅"
          : "Đã khóa tài khoản ✅"
      );
    } catch (error) {
      console.error(
        "TOGGLE ACTIVE ERROR:",
        error.response?.data ||
          error
      );

      toast.error(
        "Không thể cập nhật ❌"
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500 text-lg">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-700">
          Bảng điều khiển Admin
        </h1>
      </div>

      {/* ========================================= */}
      {/* CARD */}
      {/* ========================================= */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* TITLE */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-black" />

              <h2 className="text-5xl font-bold text-blue-700">
                Quản lý người dùng
              </h2>
            </div>

            <p className="text-gray-500 mt-2 text-xl">
              Quản lý tài khoản hệ
              thống
            </p>
          </div>

          {/* ADD BUTTON */}
          <button
            className="
              flex items-center gap-2
              bg-green-600
              hover:bg-green-700
              text-white
              px-6 py-3
              rounded-2xl
              transition
              text-2xl
            "
          >
            <UserPlus size={28} />

            Thêm người dùng
          </button>
        </div>

        {/* ========================================= */}
        {/* TABLE */}
        {/* ========================================= */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-2xl">
            <thead>
              <tr className="bg-blue-600 text-white text-xl">
                <th className="py-5 px-4 text-left">
                  ID
                </th>

                <th className="py-5 px-4 text-left">
                  Tên
                </th>

                <th className="py-5 px-4 text-center">
                  Email
                </th>

                <th className="py-5 px-4 text-center">
                  Trạng thái
                </th>

                <th className="py-5 px-4 text-center">
                  Role
                </th>

                <th className="py-5 px-4 text-center">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    Không có người dùng
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  // =========================================
                  // CHECK LOCK
                  // =========================================
                  const isLocked =
                    user.is_active ===
                      false ||
                    user.is_active ===
                      "false" ||
                    user.is_active ===
                      0;

                  return (
                    <tr
                      key={
                        user.user_id
                      }
                      className={`border-b text-center transition h-16 ${
                        isLocked
                          ? "bg-gray-400 text-gray-600 opacity-70"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-4 text-left text-xl">
                        #
                        {
                          user.user_id
                        }
                      </td>

                      {/* NAME */}
                      <td className="py-4 px-4 text-left font-semibold text-xl">
                        {
                          user.username
                        }
                      </td>

                      {/* EMAIL */}
                      <td className="py-4 px-4 text-lg">
                        {user.email}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4">
                        <span
                          className={`font-semibold text-xl ${
                            isLocked
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {isLocked
                            ? "Đã khóa"
                            : "Hoạt động"}
                        </span>
                      </td>

                      {/* ROLE */}
                      <td className="py-4 px-4 text-lg">
                        {user.role}
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-5">
                          {/* EDIT */}
                          <button
                            className="
                              text-blue-500
                              hover:text-blue-700
                              transition
                            "
                          >
                            <Edit
                              size={22}
                            />
                          </button>

                          {/* LOCK / UNLOCK */}
                          <button
                            onClick={() =>
                              toggleActive(
                                user
                              )
                            }
                            className={`transition ${
                              isLocked
                                ? "text-green-600 hover:text-green-700"
                                : "text-red-500 hover:text-red-700"
                            }`}
                          >
                            {isLocked ? (
                              <Unlock
                                size={22}
                              />
                            ) : (
                              <Lock
                                size={22}
                                className="text-red-500"
                              />
                            )}
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              deleteUser(
                                user.user_id
                              )
                            }
                            className="
                              text-red-500
                              hover:text-red-700
                              transition
                            "
                          >
                            <Trash2
                              size={22}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}