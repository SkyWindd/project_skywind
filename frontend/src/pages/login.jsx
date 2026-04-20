// Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

// ============================
// 🔐 Schema validate
// ============================
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ============================
  // ⭐ LOGIN THƯỜNG (FIX CUỐI)
  // ============================
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await authApi.login(formData);

      if (data?.success) {
        toast.success("Đăng nhập thành công ✅");

        // ⚠️ FIX QUAN TRỌNG: map user_id → id
        login({
          id: data.user.user_id,
          ...data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        navigate(data.user.role === "admin" ? "/admin" : "/");
      }
    } catch (err) {
      // ❌ KHÔNG toast lỗi ở đây
      // Axios interceptor đã xử lý toàn bộ lỗi
      console.error("❌ Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // ⭐ GOOGLE LOGIN (GIỮ NGUYÊN)
  // ============================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authApi.googleLogin({
        credential: credentialResponse.credential,
      });

      if (res.success) {
        toast.success("Đăng nhập Google thành công 🎉");

        login({
          id: res.user.user_id,
          ...res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });

        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Lỗi đăng nhập Google ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-600">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-gray-500">
            Chào mừng bạn trở lại
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>Mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            {/* Google Login */}
            <div className="mt-5 text-center">
              <div className="flex items-center my-3">
                <div className="grow border-t" />
                <span className="mx-2 text-gray-500 text-sm">hoặc</span>
                <div className="grow border-t" />
              </div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  toast.error("Đăng nhập Google thất bại ❌")
                }
              />
            </div>

            <p className="text-center text-sm mt-2">
              Chưa có tài khoản?
              <Link to="/register" className="text-blue-600 ml-1">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
