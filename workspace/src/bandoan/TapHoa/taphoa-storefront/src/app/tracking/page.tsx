'use client';

import { useState, useEffect, use } from 'react';
import { trackOrderSchema } from '@/application/validators/searchValidator';
import { MockOrderRepository } from '@/infrastructure/repositories/MockOrderRepository';
import { TrackOrderUseCase } from '@/application/use-cases/TrackOrderUseCase';
import { Order } from '@/domain/entities/Order';
import { Package, Search, Clock, CheckCircle2, Truck, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useToastStore } from '@/presentation/store/useToastStore';
import Link from 'next/link';

const orderRepo = new MockOrderRepository();
const trackOrderUseCase = new TrackOrderUseCase(orderRepo);

export default function TrackingPage({ searchParams }: { searchParams: Promise<{ orderId?: string; phone?: string }> }) {
  const resolvedParams = use(searchParams);
  const { showToast } = useToastStore();

  const [orderId, setOrderId] = useState(resolvedParams.orderId || 'WTH-1001');
  const [phone, setPhone] = useState(resolvedParams.phone || '0912345678');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);

    const validation = trackOrderSchema.safeParse({ orderId, phone });
    if (!validation.success) {
      showToast(validation.error.errors[0].message, 'error');
      setLoading(false);
      return;
    }

    const order = await trackOrderUseCase.execute(orderId, phone);
    setSearchedOrder(order);
    setLoading(false);

    if (!order) {
      showToast('Không tìm thấy đơn hàng tương ứng', 'error');
    }
  };

  useEffect(() => {
    if (resolvedParams.orderId && resolvedParams.phone) {
      trackOrderUseCase.execute(resolvedParams.orderId, resolvedParams.phone).then((res) => {
        setSearchedOrder(res);
        setSearched(true);
      });
    }
  }, [resolvedParams]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Search Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <Package className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900">Tra Cứu Tiến Trình Đơn Hàng</h1>
          <p className="text-xs text-gray-400 mt-1">Nhập mã đơn hàng và số điện thoại mua hàng để kiểm tra</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
          <input
            type="text"
            placeholder="Mã đơn (VD: WTH-1001)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-emerald-600 focus:bg-white"
          />
          <input
            type="text"
            placeholder="Số điện thoại (VD: 0912345678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-emerald-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Tra cứu</span>
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searched && (
        <>
          {searchedOrder ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Mã đơn hàng:</span>
                  <h2 className="text-xl font-black text-emerald-700">{searchedOrder.id}</h2>
                </div>
                <div className="text-xs text-right">
                  <span className="text-gray-400 block">Ngày đặt:</span>
                  <strong className="text-gray-800">{new Date(searchedOrder.createdAt).toLocaleDateString('vi-VN')}</strong>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="py-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Trạng Thái Đơn Hàng</h3>
                <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <span className="font-bold text-gray-800">Đã đặt</span>
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <span className="font-bold text-gray-800">Đã xác nhận</span>
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center font-bold animate-pulse">3</div>
                    <span className="font-bold text-amber-800">Đang giao</span>
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold">4</div>
                    <span className="font-medium text-gray-400">Hoàn thành</span>
                  </div>
                </div>
              </div>

              {/* Order Info & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Địa Chỉ Giao Hàng
                  </h4>
                  <p className="text-gray-700 font-medium">{searchedOrder.shippingAddress.fullName}</p>
                  <p className="text-gray-500">{searchedOrder.shippingAddress.phone}</p>
                  <p className="text-gray-500">
                    {searchedOrder.shippingAddress.street}, {searchedOrder.shippingAddress.ward}, {searchedOrder.shippingAddress.district}, {searchedOrder.shippingAddress.city}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Hình Thức Vận Chuyển
                  </h4>
                  <p className="text-gray-700 font-semibold">{searchedOrder.deliveryTimeSlot}</p>
                  <p className="text-gray-500">Thanh toán: COD ({searchedOrder.finalAmount.toLocaleString('vi-VN')}đ)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center space-y-3">
              <div className="text-4xl">❌</div>
              <h3 className="font-bold text-gray-800">Không tìm thấy đơn hàng</h3>
              <p className="text-xs text-gray-400">Vui lòng kiểm tra lại Mã đơn hàng hoặc Số điện thoại mua hàng.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
