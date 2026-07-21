'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Liên hệ</h1>
        <p className="text-gray-500">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-4">Thông tin liên hệ</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Địa chỉ</div>
                    <div className="text-emerald-100 text-sm">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Hotline</div>
                    <div className="text-emerald-100 text-sm">1900 1234 (8h - 22h)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Email</div>
                    <div className="text-emerald-100 text-sm">support@taphoa.vn</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Giờ làm việc</div>
                    <div className="text-emerald-100 text-sm">Thứ 2 - Chủ nhật: 6:00 - 22:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500">Bản đồ Google Maps</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          {submitted ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-black text-gray-800 mb-2">Gửi thành công!</h3>
              <p className="text-sm text-gray-500">Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-black text-gray-800 mb-5">Gửi tin nhắn</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">Họ tên</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                    placeholder="Nhập họ tên" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                      placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Số điện thoại</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                      placeholder="0912 345 678" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">Nội dung</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                    placeholder="Nhập nội dung tin nhắn..." />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Gửi tin nhắn
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
