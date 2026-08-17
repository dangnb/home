'use client';
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const statusSteps = [
  { icon: <Clock className="w-5 h-5" />, label: 'Đã đặt hàng', time: '21/07/2026 14:30' },
  { icon: <Package className="w-5 h-5" />, label: 'Đang chuẩn bị', time: '21/07/2026 14:45' },
  { icon: <Truck className="w-5 h-5" />, label: 'Đang giao hàng', time: '21/07/2026 15:10' },
  { icon: <CheckCircle className="w-5 h-5" />, label: 'Đã giao', time: '' },
];

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);
  const currentStep = 2; // Demo: Đang giao hàng

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) setSearched(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Theo dõi đơn hàng</h1>
        <p className="text-gray-500">Nhập mã đơn hàng để xem trạng thái giao hàng</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Nhập mã đơn hàng (VD: TH-20260721-001)" required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all" />
          </div>
          <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex-shrink-0">
            Tra cứu
          </button>
        </div>
      </form>

      {/* Result */}
      {searched && (
        <div className="max-w-2xl mx-auto animate-fadeInUp">
          {/* Order Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-xs text-gray-400 font-medium">Mã đơn hàng</span>
                <div className="font-black text-gray-800">{orderId || 'TH-20260721-001'}</div>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg">Đang giao hàng</span>
            </div>

            {/* Status Timeline */}
            <div className="space-y-0">
              {statusSteps.map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-full min-h-[2rem] ${i < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className={`font-bold text-sm ${i <= currentStep ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</div>
                    {step.time && <span className="text-xs text-gray-400">{step.time}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-500">
              Có vấn đề với đơn hàng? Liên hệ hotline <span className="text-emerald-600 font-bold">1900 1234</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
