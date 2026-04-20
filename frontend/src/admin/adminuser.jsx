import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, X, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

export default function AdminUser() {
  const API_URL = "http://localhost:5003/api/users/";

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    is_active: true,
  });

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    is_active: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================
  // GET USERS
  // ========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch {
      toast.error("Không thể tải danh sách user ❌");
    }
  };

  // ========================
  // CREATE USER
  // ========================
  const handleCreateUser = async () => {
    try {
      const res = await axios.post(API_URL, newUser);
      if (res.data.success) {
        toast.success("🎉 Tạo user thành công");
        setOpenCreate(false);
        fetchUsers();
        setNewUser({
          username: "",
          email: "",
          password: "",
          role: "user",
          is_active: true,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Lỗi tạo user ❌");
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

      if (res.data.success) {
        toast.success("Cập nhật thành công ✅");
        setEditingUser(null);
        fetchUsers();
      }
    } catch {
      toast.error("Lỗi cập nhật ❌");
    }
  };

  // ========================
  // TOGGLE ACTIVE
  // ========================
  const toggleActive = async (user) => {
    try {
      await axios.put(`${API_URL}/${user.user_id}`, {
        ...user,
        is_active: !user.is_active,
      });
      fetchUsers();
      toast.success("Đã cập nhật trạng thái");
    } catch {
      toast.error("Không thể cập nhật ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        👥 Quản lý người dùng
      </h2>

      <button
        onClick={() => setOpenCreate(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        ➕ Thêm người dùng
      </button>

      <table className="w-full bg-white border rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-t text-center">
              <td>{u.user_id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                {u.is_active ? (
                  <span className="text-green-600">Hoạt động</span>
                ) : (
                  <span className="text-red-600">Khoá</span>
                )}
              </td>
              <td>{u.role}</td>
              <td className="flex justify-center gap-3 p-2">
                <button onClick={() => {
                  setEditingUser(u);
                  setFormData(u);
                }}>
                  <Edit size={18} />
                </button>

                <button onClick={() => toggleActive(u)}>
                  {u.is_active ? <Lock /> : <Unlock />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CREATE MODAL */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="font-semibold mb-3">Thêm user</h3>

            <input
              placeholder="Username"
              className="input"
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="input"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <select
              className="input"
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setOpenCreate(false)}>Huỷ</button>
              <button
                onClick={handleCreateUser}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="font-semibold mb-3">
              Sửa user #{editingUser.user_id}
            </h3>

            <input
              value={formData.username}
              className="input"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <input
              value={formData.email}
              className="input"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <select
              value={formData.role}
              className="input"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingUser(null)}>Huỷ</button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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
