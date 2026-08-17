'use client';
import { Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-10 text-white">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-400/20 rounded-full blur-xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-black mb-2">Đăng ký nhận ưu đãi</h3>
          <p className="text-emerald-100 text-sm">Nhận thông báo khuyến mãi và mã giảm giá độc quyền qua email mỗi tuần.</p>
        </div>
        <div className="w-full md:w-auto">
          {submitted ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center font-medium animate-fadeIn">
              ✅ Đã đăng ký thành công!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-800 text-sm font-medium outline-none focus:ring-4 focus:ring-white/30 placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="bg-white text-emerald-700 font-bold px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-1.5 flex-shrink-0">
                Đăng ký
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
