import { Link } from "react-router-dom"
import { useState } from "react"
import { Mail, SendHorizontal } from "lucide-react"
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Gửi request reset password ở đây
    console.log("Reset link sent to:", email)
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg border border-blue-100 rounded-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-600">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-blue-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-xl mt-4 transition-all"
            >
              <SendHorizontal size={18} />
              Gửi liên kết đặt lại
            </Button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Quay lại{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
