import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, X, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    is_active: true,
  });

  const API_URL = "http://localhost:5000/api/users";

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      toast.error("Không thể tải danh sách người dùng ❌");
    }
  };

  // ✅ Mở modal chỉnh sửa
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
  };

  // ✅ Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  // ✅ Lưu thay đổi trong modal
  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_URL}/${editingUser.user_id}`, formData);

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === editingUser.user_id ? { ...u, ...formData } : u
          )
        );
        toast.success("Cập nhật người dùng thành công ✅");
        setEditingUser(null);
      } else {
        toast.error(res.data.message || "Cập nhật thất bại ❌");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      toast.error("Không thể kết nối đến server ❌");
    }
  };

  // ✅ Nút chuyển trạng thái (Khóa / Mở)
  const toggleActive = async (user) => {
    try {
      const updated = { ...user, is_active: !user.is_active };
      const res = await axios.put(`${API_URL}/${user.user_id}`, updated);

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id ? { ...u, is_active: updated.is_active } : u
          )
        );

        if (updated.is_active) {
          toast.success(`✅ Đã mở khóa người dùng "${user.username}"`);
        } else {
          toast.error(`🔒 Đã khóa người dùng "${user.username}"`);
        }
      } else {
        toast.error("Cập nhật trạng thái thất bại ❌");
      }
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái:", err);
      toast.error("Không thể kết nối đến server ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        👥 Danh sách người dùng
      </h2>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Tên đăng nhập</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Vai trò</th>
            <th className="px-4 py-2 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr
                key={u.user_id}
                className={`border-t transition-all duration-300 ${
                  u.is_active
                    ? "hover:bg-gray-100"
                    : "opacity-50 bg-gray-100 cursor-not-allowed"
                }`}
              >
                <td className="px-4 py-2">{u.user_id}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>

                <td className="px-4 py-2">
                  {u.is_active ? (
                    <span className="text-green-600 font-semibold">Hoạt động</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Khoá</span>
                  )}
                </td>

                <td className="px-4 py-2">{u.role}</td>

                <td className="px-4 py-2 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEditClick(u)}
                    disabled={!u.is_active}
                    className={`transition-all duration-300 ${
                      u.is_active
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => toggleActive(u)}
                    className={`transition-all duration-300 ${
                      u.is_active
                        ? "text-red-600 hover:text-red-800"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  >
                    {u.is_active ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Không có người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal chỉnh sửa */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative animate-fadeIn">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h4 className="text-lg font-semibold mb-4 text-blue-700">
              Chỉnh sửa người dùng #{editingUser.user_id}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Tên đăng nhập</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vai trò</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value={true}>Hoạt động</option>
                  <option value={false}>Khoá</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Hủy
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
