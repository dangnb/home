'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const cart = useCartStore();
  const { customer } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'Cash'
  });

  useEffect(() => {
    setMounted(true);
    if (customer) {
      setForm(f => ({
        ...f,
        name: customer.fullName || '',
        phone: customer.phoneNumber || ''
      }));
    }
  }, [customer]);

  if (!mounted) return null;

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
        <h1 className="text-3xl font-black mb-4">Đặt hàng thành công!</h1>
        <p className="text-gray-600 max-w-md mb-8">
          Cảm ơn bạn đã mua sắm tại TapHoa. Đơn hàng của bạn đang chờ phê duyệt. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>
        <Link href="/" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <Link href="/" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-colors">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        notes: form.notes,
        paymentMethod: form.paymentMethod === 'Cash' ? 1 : 2, // 1 = Cash, 2 = BankTransfer (matching backend enum)
        loggedInCustomerId: customer?.id || null,
        pointsToUse: usePoints && customer ? customer.loyaltyPoints : 0,
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price
        }))
      };

      const res = await fetch('http://localhost:5222/api/v1/online-store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        cart.clearCart();
      } else {
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra. Không thể kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại mua sắm
      </Link>
      
      <h1 className="text-2xl font-black mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-bold mb-6">Thông tin giao hàng</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input 
                  required
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                <input 
                  required
                  type="tel" 
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng *</label>
                <input 
                  required
                  type="text" 
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
                <textarea 
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                ></textarea>
              </div>

              <h2 className="text-lg font-bold mt-8 mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${form.paymentMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Cash"
                    checked={form.paymentMethod === 'Cash'}
                    onChange={() => setForm({...form, paymentMethod: 'Cash'})}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="ml-3 font-medium">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${form.paymentMethod === 'BankTransfer' ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="BankTransfer"
                    checked={form.paymentMethod === 'BankTransfer'}
                    onChange={() => setForm({...form, paymentMethod: 'BankTransfer'})}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="ml-3 font-medium">Chuyển khoản qua mã QR</span>
                </label>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
            <h2 className="text-lg font-bold mb-6">Đơn hàng của bạn ({cart.getItemCount()} sản phẩm)</h2>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:5222${item.product.imageUrl}`} alt="" className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-xs text-gray-400">Ảnh</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium line-clamp-1">{item.product.name}</div>
                      <div className="text-xs text-gray-500">SL: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-sm whitespace-nowrap ml-4">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span>
                <span>{cart.getTotal().toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              {customer && customer.loyaltyPoints > 0 && (
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2 py-2 border-t border-dashed">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={usePoints}
                      onChange={e => setUsePoints(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                    />
                    <span>Dùng <b>{customer.loyaltyPoints}</b> điểm Loyalty</span>
                  </label>
                  <span className="text-red-500 font-medium">
                    {usePoints ? `-${(customer.loyaltyPoints * 1000).toLocaleString('vi-VN')}₫` : '0₫'}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black border-t pt-3 mt-3">
                <span>Tổng cộng</span>
                <span className="text-emerald-600">
                  {Math.max(0, cart.getTotal() - (usePoints && customer ? customer.loyaltyPoints * 1000 : 0)).toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full mt-6 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'Hoàn tất đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
