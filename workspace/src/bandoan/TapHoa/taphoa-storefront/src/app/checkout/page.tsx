'use client';

import { useState } from 'react';
import { useCartStore } from '@/presentation/store/useCartStore';
import { useToastStore } from '@/presentation/store/useToastStore';
import { checkoutSchema, CheckoutFormData } from '@/application/validators/checkoutValidator';
import { MockOrderRepository } from '@/infrastructure/repositories/MockOrderRepository';
import { CreateOrderUseCase } from '@/application/use-cases/CreateOrderUseCase';
import { Order, PaymentMethod } from '@/domain/entities/Order';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/presentation/components/ui/ProductImage';

const orderRepo = new MockOrderRepository();
const createOrderUseCase = new CreateOrderUseCase(orderRepo);

export default function CheckoutPage() {
  const { items, couponCode, getTotalPrice, getShippingFee, getFinalPrice, clearCart } = useCartStore();
  const { showToast } = useToastStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    city: 'TP. Hồ Chí Minh',
    district: '',
    ward: '',
    street: '',
    deliveryTimeSlot: 'Giao ngay trong 2 giờ',
    paymentMethod: 'cod',
    discountCode: couponCode || '',
    note: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const totalPrice = getTotalPrice();
  const shippingFee = getShippingFee();
  const finalPrice = getFinalPrice();

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Zod validation
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formattedErrors);
      showToast('Vui lòng kiểm tra lại các thông tin bắt buộc', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }

    // 2. Submit order via UseCase
    setIsSubmitting(true);
    try {
      const newOrder = await createOrderUseCase.execute({
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          street: formData.street,
          note: formData.note
        },
        deliveryTimeSlot: formData.deliveryTimeSlot,
        paymentMethod: formData.paymentMethod as PaymentMethod,
        items,
        discountCode: formData.discountCode
      });

      setCreatedOrder(newOrder);
      clearCart();
      showToast('Đặt hàng thành công!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Đặt hàng thất bại, vui lòng thử lại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (createdOrder) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">Đặt Hàng Thành Công!</h1>
          <p className="text-xs text-gray-500">Cảm ơn bạn đã tin tưởng dịch vụ của Web Tạp Hóa.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-400">Mã đơn hàng:</span>
            <span className="text-base font-black text-emerald-700">{createdOrder.id}</span>
          </div>

          <div className="space-y-1.5 text-xs text-gray-600">
            <div><strong>Người nhận:</strong> {createdOrder.shippingAddress.fullName} ({createdOrder.shippingAddress.phone})</div>
            <div><strong>Địa chỉ:</strong> {createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.ward}, {createdOrder.shippingAddress.district}, {createdOrder.shippingAddress.city}</div>
            <div><strong>Thời gian giao:</strong> {createdOrder.deliveryTimeSlot}</div>
            <div><strong>Thanh toán:</strong> {createdOrder.paymentMethod.toUpperCase()} (Khi nhận hàng)</div>
            <div className="pt-2 text-sm font-bold text-gray-900 flex justify-between">
              <span>Tổng tiền:</span>
              <span className="text-emerald-700">{createdOrder.finalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/tracking?orderId=${createdOrder.id}&phone=${createdOrder.shippingAddress.phone}`}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Theo dõi tiến trình đơn hàng</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Không có sản phẩm nào để thanh toán</h2>
        <Link href="/" className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Quay về mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-black text-gray-900">Thanh Toán & Đặt Hàng</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Thông Tin Giao Hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-hidden ${
                    errors.fullName ? 'border-rose-500 bg-rose-50' : 'border-gray-200 focus:border-emerald-600'
                  }`}
                />
                {errors.fullName && <p className="text-rose-500 text-[11px] font-medium">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Số điện thoại *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0912345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-hidden ${
                    errors.phone ? 'border-rose-500 bg-rose-50' : 'border-gray-200 focus:border-emerald-600'
                  }`}
                />
                {errors.phone && <p className="text-rose-500 text-[11px] font-medium">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Tỉnh / Thành phố *</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-emerald-600 bg-white"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Quận / Huyện *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quận 1"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-hidden ${
                    errors.district ? 'border-rose-500 bg-rose-50' : 'border-gray-200 focus:border-emerald-600'
                  }`}
                />
                {errors.district && <p className="text-rose-500 text-[11px] font-medium">{errors.district}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Phường / Xã *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phường Bến Nghé"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-hidden ${
                    errors.ward ? 'border-rose-500 bg-rose-50' : 'border-gray-200 focus:border-emerald-600'
                  }`}
                />
                {errors.ward && <p className="text-rose-500 text-[11px] font-medium">{errors.ward}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-gray-700">Địa chỉ chi tiết (Tên đường, số nhà) *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 123 Nguyễn Huệ"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl focus:outline-hidden ${
                    errors.street ? 'border-rose-500 bg-rose-50' : 'border-gray-200 focus:border-emerald-600'
                  }`}
                />
                {errors.street && <p className="text-rose-500 text-[11px] font-medium">{errors.street}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Slot */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-gray-900">Chọn Khung Giờ Giao Hàng</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {['Giao ngay trong 2 giờ', 'Sáng mai (8h - 12h)', 'Chiều mai (14h - 18h)'].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => handleInputChange('deliveryTimeSlot', slot)}
                  className={`p-3 rounded-2xl border text-center font-semibold transition-all ${
                    formData.deliveryTimeSlot === slot
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                      : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán tiền mặt trực tiếp cho shipper' },
                { id: 'momo', name: 'Ví điện tử MoMo', desc: 'Quét mã QR MoMo tiện lợi' },
                { id: 'vnpay', name: 'Ví VNPay / Ngân hàng', desc: 'Thanh toán qua cổng VNPay QR' },
                { id: 'banking', name: 'Chuyển khoản Ngân hàng', desc: 'Chuyển khoản theo cú pháp mã đơn' },
              ].map((pm) => (
                <label
                  key={pm.id}
                  onClick={() => handleInputChange('paymentMethod', pm.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === pm.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                      : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === pm.id}
                    onChange={() => {}}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <div>
                    <strong className="block font-bold">{pm.name}</strong>
                    <span className="text-gray-500 text-[11px]">{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 h-fit">
          <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Đơn Hàng ({items.length} món)</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-xs">
                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-100">
                  <ProductImage src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 truncate">{item.product.name}</div>
                  <div className="text-gray-400">x{item.quantity} {item.product.unit}</div>
                </div>
                <div className="font-bold text-gray-900">
                  {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span className="font-bold text-gray-800">{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-bold text-gray-800">
                {shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : `${shippingFee.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
            {formData.discountCode && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Giảm giá ({formData.discountCode}):</span>
                <span>-10.000đ</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-100">
              <span>Tổng thanh toán:</span>
              <span className="text-emerald-700">{finalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
          >
            {isSubmitting ? 'ĐANG XỬ LÝ ĐƠN HÀNG...' : 'XÁC NHẬN ĐẶT HÀNG NGAY'}
          </button>
        </div>
      </form>
    </div>
  );
}
