import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// ✅ Schema validate với Zod
const registerSchema = z
  .object({
    fullname: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    confirm: z.string().min(6, "Xác nhận mật khẩu không hợp lệ"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm"],
  })

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ✅ Gắn react-hook-form + zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data) => {
    console.log("Đăng ký với:", data)
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-transparent px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <UserPlus className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-600">Tạo tài khoản</CardTitle>
          <CardDescription className="text-gray-500">
            Điền thông tin để đăng ký
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Họ tên */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="fullname">Họ và tên</Label>
              <Input id="fullname" placeholder="Nguyễn Văn A" {...register("fullname")} />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
            </div>

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

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirm")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm.message}</p>}
            </div>

            {/* Nút đăng ký */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Tạo tài khoản
            </Button>

            {/* Link chuyển sang đăng nhập */}
            <p className="text-center text-sm text-gray-600 mt-2">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
