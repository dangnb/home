'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { Phone, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    phoneNumber: '',
    fullName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login({
        phoneNumber: form.phoneNumber,
        fullName: form.fullName
      });

      login(result.token, {
        id: result.customerId,
        fullName: result.fullName,
        phoneNumber: form.phoneNumber,
        loyaltyPoints: result.loyaltyPoints,
        tier: result.tier
      });

      router.push('/profile');
    } catch (err: any) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 bg-white rounded-3xl p-8 md:p-10 w-full max-w-md border border-gray-100 shadow-xl animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200/50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">Chào mừng bạn!</h1>
          <p className="text-gray-500 mt-2 text-sm">Nhập số điện thoại để đăng nhập hoặc tạo tài khoản mới</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm"
                placeholder="Ví dụ: 0912345678"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên <span className="text-gray-400 font-normal">(Tùy chọn)</span></label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm"
                placeholder="Dành cho khách hàng mới"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Nếu bạn chưa có tài khoản, hệ thống sẽ tự động tạo cho bạn.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-200/50 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Tiếp tục <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <Link href="#" className="text-emerald-600 font-medium hover:underline">Điều khoản dịch vụ</Link> và{' '}
          <Link href="#" className="text-emerald-600 font-medium hover:underline">Chính sách bảo mật</Link>.
        </div>
      </div>
    </div>
  );
}
