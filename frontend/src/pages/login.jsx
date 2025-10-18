import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { authApi } from "@/api/authApi"
import { useAuth } from "@/context/AuthContext"

// ✅ Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
})

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()  // <-- sử dụng AuthContext

  // ✅ Gắn react-hook-form + zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // ✅ Submit form
  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const res = await authApi.login(formData)

      if (!res.success) {
        toast.error(res.message || "Đăng nhập thất bại")
      } else {
        toast.success("Đăng nhập thành công ✅")
        login(res.data) // Lưu vào AuthContext
      }
    } catch (error) {
      toast.error("Lỗi kết nối server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-transparent px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-600">Đăng nhập</CardTitle>
          <CardDescription className="text-gray-500">
            Chào mừng bạn trở lại
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
