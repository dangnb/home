'use client';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const itemCount = useCartStore((state) => state.getItemCount());
  const { customer, login, logout, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5222/api/v1/online-store/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token, {
          id: data.customerId,
          fullName: data.fullName,
          phoneNumber: phone,
          loyaltyPoints: data.loyaltyPoints,
          tier: data.tier
        });
        setIsLoginModalOpen(false);
      } else {
        alert('Đăng nhập thất bại.');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-emerald-600">
                TapHoa<span className="text-gray-900">.</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-full text-sm transition-all outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {mounted && customer ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-emerald-600"
                >
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                    {customer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{customer.fullName}</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <div className="text-xs text-gray-500">Điểm Loyalty</div>
                      <div className="font-bold text-emerald-600">{customer.loyaltyPoints} điểm</div>
                    </div>
                    <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Đơn hàng của tôi
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-full transition-colors hidden sm:block"
              >
                Đăng nhập
              </button>
            ) : null}

            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black mb-2">Đăng nhập</h2>
            <p className="text-gray-500 text-sm mb-6">Nhập số điện thoại của bạn để tiếp tục.</p>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="0912345678"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập / Đăng ký'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
