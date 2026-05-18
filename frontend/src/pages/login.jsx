

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

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
// VALIDATION
// ============================
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),

  password: z
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export default function Login() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

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
  // LOGIN
  // ============================
  const onSubmit = async (formData) => {

    try {

      setLoading(true);

      const data =
        await authApi.login(formData);

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // SUCCESS
      if (data?.success) {

        toast.success(
          "🎉 Đăng nhập thành công"
        );

        login({
          id: data.user.user_id,

          ...data.user,

          accessToken:
            data.accessToken,

          refreshToken:
            data.refreshToken,
        });

        // ROLE REDIRECT
        navigate(
          data.user.role === "admin"
            ? "/admin"
            : "/"
        );
      }

    } catch (err) {

      console.error(
        "❌ LOGIN ERROR:",
        err.response?.data || err
      );

      // ⭐ FIX TOAST ERROR
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Đăng nhập thất bại ❌"
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================
  // GOOGLE LOGIN
  // ============================
  const handleGoogleSuccess =
    async (credentialResponse) => {

      try {

        const res =
          await authApi.googleLogin({
            credential:
              credentialResponse.credential,
          });

        if (res.success) {

          toast.success(
            "🎉 Đăng nhập Google thành công"
          );

          login({
            id: res.user.user_id,

            ...res.user,

            accessToken:
              res.accessToken,

            refreshToken:
              res.refreshToken,
          });

          navigate("/");
        }

      } catch (error) {

        console.error(
          "GOOGLE LOGIN ERROR:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
          "Lỗi đăng nhập Google ❌"
        );
      }
    };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">

      <Card className="w-full max-w-md shadow-lg border border-gray-200">

        <CardHeader className="text-center">

          <div className="flex justify-center mb-3">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>

          <CardTitle className="text-3xl font-bold text-blue-600">
            Đăng nhập
          </CardTitle>

          <CardDescription className="text-gray-500">
            Chào mừng bạn trở lại
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {/* EMAIL */}
            <div>

              <Label>Email</Label>

              <Input
                type="email"
                placeholder="Nhập email..."
                {...register("email")}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* PASSWORD */}
            <div>

              <Label>Mật khẩu</Label>

              <div className="relative">

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Nhập mật khẩu..."
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Đang đăng nhập..."
                : "Đăng nhập"}
            </Button>

            {/* GOOGLE */}
            <div className="mt-5 text-center">

              <div className="flex items-center my-3">

                <div className="grow border-t" />

                <span className="mx-2 text-gray-500 text-sm">
                  hoặc
                </span>

                <div className="grow border-t" />

              </div>

              <GoogleLogin
                onSuccess={
                  handleGoogleSuccess
                }
                onError={() =>
                  toast.error(
                    "Đăng nhập Google thất bại ❌"
                  )
                }
              />

            </div>

            {/* REGISTER */}
            <p className="text-center text-sm mt-2">

              Chưa có tài khoản?

              <Link
                to="/register"
                className="text-blue-600 ml-1"
              >
                Đăng ký ngay
              </Link>

            </p>

          </form>

        </CardContent>
      </Card>
    </div>
  );
}

