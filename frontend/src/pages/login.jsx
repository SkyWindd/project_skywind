import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg border border-blue-100 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold text-blue-600">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Vui lòng nhập thông tin để tiếp tục
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-blue-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                className="mt-1"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <Label htmlFor="password" className="text-blue-700">
                Mật khẩu
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Link phụ */}
            <div className="flex justify-between items-center text-sm text-blue-600">
              <Link to="/forgotpassword" className="text-blue-600 hover:underline font-medium">
                Quên mật khẩu?
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Đăng ký
              </Link>
            </div>

            {/* Nút đăng nhập */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-xl mt-4 transition-all"
            >
              <LogIn size={18} />
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
