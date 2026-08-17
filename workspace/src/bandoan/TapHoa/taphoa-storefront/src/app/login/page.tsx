'use client';

import { useState } from 'react';
import { User, Lock, Phone, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    clearMessages();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (isRegister && !fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên');
      return;
    }

    if (!phone.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    setSuccessMessage(isRegister ? 'Đăng ký tài khoản thành công! Đang đăng nhập...' : 'Đăng nhập thành công!');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md space-y-6">
        {/* Title & Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00904a] to-[#006633] text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-[#00904a]/30">
            W
          </div>
          <h1 className="text-xl font-black text-gray-900">
            {isRegister ? 'Đăng Ký Tài Khoản Web Tạp Hóa' : 'Đăng Nhập Khách Hàng'}
          </h1>
          <p className="text-xs text-gray-400">Tích điểm mua sắm & nhận nhiều ưu đãi hấp dẫn</p>
        </div>

        {/* Inline Message Banners (Alert on top of form) */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Họ và tên *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearMessages();
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-[#00904a] focus:bg-white transition-colors"
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
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearMessages();
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-[#00904a] focus:bg-white transition-colors"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearMessages();
                }}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-[#00904a] focus:bg-white transition-colors"
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
            className="w-full py-3.5 bg-[#00904a] hover:bg-[#007a3e] text-white rounded-2xl font-bold shadow-md shadow-[#00904a]/20 transition-all cursor-pointer"
          >
            {isRegister ? 'ĐĂNG KÝ TÀI KHOẢN' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs">
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-[#00904a] font-bold hover:underline cursor-pointer"
          >
            {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký mới'}
          </button>
        </div>
      </div>
    </div>
  );
}
