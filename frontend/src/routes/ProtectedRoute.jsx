import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // ⭐ 1. Chờ AuthContext load user từ sessionStorage
  if (user === null) {
    return (
      <div className="p-10 text-center text-gray-600 font-semibold">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  // ⭐ 2. Nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ⭐ 3. Check quyền admin
  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // ⭐ 4. Cho phép truy cập
  return children;
}
