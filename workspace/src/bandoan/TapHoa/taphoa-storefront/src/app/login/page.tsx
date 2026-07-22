'use client';

import { useState } from 'react';
import { useToastStore } from '@/presentation/store/useToastStore';
import { User, Lock, Phone, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      showToast('Vui lòng nhập đầy đủ số điện thoại và mật khẩu', 'error');
      return;
    }

    if (isRegister && !fullName) {
      showToast('Vui lòng nhập Họ và tên', 'error');
      return;
    }

    showToast(isRegister ? 'Đăng ký tài khoản thành công!' : 'Đăng nhập thành công!', 'success');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-emerald-600/30">
            T
          </div>
          <h1 className="text-xl font-black text-gray-900">
            {isRegister ? 'Đăng Ký Tài Khoản Web Tạp Hóa' : 'Đăng Nhập Khách Hàng'}
          </h1>
          <p className="text-xs text-gray-400">Tích điểm mua sắm & nhận nhiều ưu đãi hấp dẫn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Họ và tên *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Số điện thoại *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Mật khẩu *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/30 transition-all"
          >
            {isRegister ? 'ĐĂNG KÝ TÀI KHOẢN' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-700 font-bold hover:underline"
          >
            {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
