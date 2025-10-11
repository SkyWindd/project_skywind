import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-transparent px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <UserPlus className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-600">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-gray-500">
            Nhập thông tin của bạn để tạo tài khoản mới
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            {/* Họ tên */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="fullname">Họ và tên</Label>
              <Input id="fullname" type="text" placeholder="Nguyễn Văn A" required />
            </div>

            {/* Email */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1 text-blue-700">
              <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-700"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
