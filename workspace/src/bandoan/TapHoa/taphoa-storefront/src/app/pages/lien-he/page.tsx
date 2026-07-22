'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useToastStore } from '@/presentation/store/useToastStore';

export default function LienHePage() {
  const { showToast } = useToastStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    showToast('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Liên hệ</span>
      </nav>

      <h1 className="text-xl font-bold text-gray-900">Liên Hệ Với Chúng Tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Contact info */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Thông tin liên hệ</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00904a] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-800 block">Địa chỉ</strong>
                  123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#00904a] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-800 block">Hotline</strong>
                  1900 8888
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#00904a] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-800 block">Email</strong>
                  cskh@webtaphoa.vn
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#00904a] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-800 block">Giờ làm việc</strong>
                  Thứ 2 - CN: 7h00 - 22h00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Gửi tin nhắn cho chúng tôi</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 text-xs">Họ và tên *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00904a]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 text-xs">Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00904a]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 text-xs">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00904a]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 text-xs">Nội dung *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Nội dung liên hệ của bạn..."
                rows={5}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00904a] resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#00904a] hover:bg-[#007a3e] text-white font-bold text-sm rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              Gửi Liên Hệ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
