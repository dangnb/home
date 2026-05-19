"use client";

// Customer Login / Register Page

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginCustomer, registerCustomer } from "@/actions/customer-auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isLogin) {
      const result = await loginCustomer(email, password);
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        router.back();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } else {
      const name = formData.get("name") as string;
      const result = await registerCustomer(name, email, password);
      if (result.success) {
        toast.success("Đăng ký thành công!");
        router.back();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            {isLogin
              ? "Đăng nhập để bình luận và lưu sản phẩm yêu thích"
              : "Tạo tài khoản để trải nghiệm đầy đủ"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border shadow-sm space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" name="name" required placeholder="Nguyễn Văn A" className="h-11" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" minLength={6} className="h-11" />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-semibold hover:underline">
              {isLogin ? "Đăng ký" : "Đăng nhập"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
