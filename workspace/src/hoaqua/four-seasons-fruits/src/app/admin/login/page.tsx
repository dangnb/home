"use client";

// Admin Login Page

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await loginAdmin(email, password);

    if (result.success) {
      toast.success("Đăng nhập thành công!");
      router.push("/admin");
      router.refresh();
    } else {
      toast.error(result.error || "Đăng nhập thất bại");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-700">
              Four Seasons
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Đăng nhập để quản lý cửa hàng</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl border shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@fourseasons.vn"
              defaultValue="admin@fourseasons.vn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              defaultValue="admin123"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Demo: admin@fourseasons.vn / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
