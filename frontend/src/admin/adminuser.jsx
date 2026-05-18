
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Edit,
  Lock,
  Unlock,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

export default function AdminUser() {

  const API_URL =
    "http://localhost:8000/users/api/users";

  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] =
    useState(null);

  const [openCreate, setOpenCreate] =
    useState(false);

  // ========================
  // FORM EDIT
  // ========================
  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      role: "user",
      is_active: true,
    });

  // ========================
  // FORM CREATE
  // ========================
  const [newUser, setNewUser] =
    useState({
      username: "",
      email: "",
      password: "",
      role: "user",
      is_active: true,
    });

  // ========================
  // LOAD USERS
  // ========================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================
  // GET USERS
  // ========================
  const fetchUsers = async () => {

    try {

      const res = await axios.get(API_URL);

      const userList = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];

      setUsers(userList);

    } catch (error) {

      console.error(
        "GET USERS ERROR:",
        error.response?.data || error
      );

      toast.error(
        "Không thể tải danh sách user ❌"
      );
    }
  };

  // ========================
  // CREATE USER
  // ========================
  const handleCreateUser = async () => {

    try {

      // EMPTY
      if (
        !newUser.username ||
        !newUser.email ||
        !newUser.password
      ) {
        toast.error(
          "Vui lòng nhập đầy đủ thông tin"
        );
        return;
      }

      // EMAIL
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          newUser.email
        )
      ) {
        toast.error(
          "Email không hợp lệ ❌"
        );
        return;
      }

      // ⭐ PASSWORD 6 SỐ
      const passwordRegex =
        /^\d{6}$/;

      if (
        !passwordRegex.test(
          newUser.password
        )
      ) {
        toast.error(
          "Mật khẩu phải gồm đúng 6 chữ số"
        );
        return;
      }

      const res = await axios.post(
        API_URL,
        newUser
      );

      if (res.status === 201) {

        toast.success(
          "🎉 Tạo user thành công"
        );

        setOpenCreate(false);

        fetchUsers();

        // RESET
        setNewUser({
          username: "",
          email: "",
          password: "",
          role: "user",
          is_active: true,
        });
      }

    } catch (error) {

      console.error(
        "CREATE USER ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Lỗi tạo user ❌"
      );
    }
  };

  // ========================
  // UPDATE USER
  // ========================
  const handleSave = async () => {

    try {

      const res = await axios.put(
        `${API_URL}/${editingUser.user_id}`,
        formData
      );

      if (res.status === 200) {

        toast.success(
          "Cập nhật thành công ✅"
        );

        setEditingUser(null);

        fetchUsers();
      }

    } catch (error) {

      console.error(
        "UPDATE USER ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.error ||
        "Lỗi cập nhật ❌"
      );
    }
  };

  // ========================
  // TOGGLE ACTIVE
  // ========================
  const toggleActive = async (user) => {

    try {

      const updatedUser = {
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: !user.is_active,
      };

      await axios.put(
        `${API_URL}/${user.user_id}`,
        updatedUser
      );

      toast.success(
        user.is_active
          ? "Đã khóa tài khoản"
          : "Đã mở khóa tài khoản"
      );

      fetchUsers();

    } catch (error) {

      console.error(
        "TOGGLE ACTIVE ERROR:",
        error.response?.data || error
      );

      toast.error(
        "Không thể cập nhật ❌"
      );
    }
  };

  // ========================
  // DELETE USER
  // ========================
  const handleDelete = async (userId) => {

    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xoá user này?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/${userId}`
      );

      toast.success(
        "Xóa user thành công"
      );

      fetchUsers();

    } catch (error) {

      console.error(
        "DELETE USER ERROR:",
        error.response?.data || error
      );

      toast.error(
        "Không thể xoá user ❌"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <div className="flex items-center justify-between mb-5">

        <div>
          <h2 className="text-3xl font-bold text-blue-700">
            👥 Quản lý người dùng
          </h2>

          <p className="text-gray-500 mt-1">
            Quản lý tài khoản hệ thống
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
        >
          ➕ Thêm người dùng
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr className="h-14">
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Role</th>
              <th>Hành động</th>
            </tr>

          </thead>

          <tbody>

            {users.length > 0 ? (
              users.map((user) => {

                // ⭐ USER KHÓA
                const isLocked =
                  !user.is_active;

                return (
                  <tr
                    key={user.user_id}
                    className={`border-b text-center transition h-14 ${
                      isLocked
                        ? "bg-gray-300 opacity-60"
                        : "hover:bg-gray-50"
                    }`}
                  >

                    <td>
                      #{user.user_id}
                    </td>

                    <td className="font-medium">
                      {user.username}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>

                      {user.is_active ? (
                        <span className="text-green-600 font-semibold">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Đã khóa
                        </span>
                      )}

                    </td>

                    <td>
                      {user.role}
                    </td>

                    <td>

                      <div className="flex justify-center gap-4">

                        {/* EDIT */}
                        <button
                          disabled={isLocked}
                          onClick={() => {

                            setEditingUser(user);

                            setFormData({
                              username:
                                user.username,

                              email:
                                user.email,

                              role:
                                user.role,

                              is_active:
                                user.is_active,
                            });
                          }}
                          className={`${
                            isLocked
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          <Edit size={18} />
                        </button>

                        {/* LOCK / UNLOCK */}
                        <button
                          onClick={() =>
                            toggleActive(user)
                          }
                          className={`${
                            isLocked
                              ? "text-green-600 hover:text-green-700"
                              : "text-orange-500 hover:text-orange-700"
                          }`}
                        >
                          {isLocked ? (
                            <Unlock size={18} />
                          ) : (
                            <Lock size={18} />
                          )}
                        </button>

                        {/* DELETE */}
                        <button
                          disabled={isLocked}
                          onClick={() =>
                            handleDelete(
                              user.user_id
                            )
                          }
                          className={`${
                            isLocked
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-500 hover:text-red-700"
                          }`}
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  Không có user nào
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* ======================================
          CREATE MODAL
      ====================================== */}
      {openCreate && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">

            <h3 className="text-xl font-semibold mb-4">
              ➕ Thêm user
            </h3>

            <div className="space-y-3">

              <input
                placeholder="Username"
                value={newUser.username}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    username:
                      e.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                value={newUser.email}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email:
                      e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password (6 số)"
                value={newUser.password}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password:
                      e.target.value,
                  })
                }
              />

              <select
                value={newUser.role}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role:
                      e.target.value,
                  })
                }
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() =>
                  setOpenCreate(false)
                }
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Huỷ
              </button>

              <button
                onClick={handleCreateUser}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Tạo
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================
          EDIT MODAL
      ====================================== */}
      {editingUser && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">

            <h3 className="text-xl font-semibold mb-4">
              ✏️ Sửa user
            </h3>

            <div className="space-y-3">

              <input
                value={formData.username}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username:
                      e.target.value,
                  })
                }
              />

              <input
                value={formData.email}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }
              />

              <select
                value={formData.role}
                className="w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role:
                      e.target.value,
                  })
                }
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() =>
                  setEditingUser(null)
                }
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Huỷ
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Lưu
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

