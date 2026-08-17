import Link from 'next/link';
import { Truck, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function ChinhSachGiaoHangPage() {
  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Chính sách giao hàng</span>
      </nav>
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 space-y-5">
        <h1 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Chính Sách Giao Hàng</h1>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center space-y-2">
              <Truck className="w-8 h-8 text-[#00904a] mx-auto" />
              <h4 className="font-bold text-gray-900">Giao hàng nhanh 2-4h</h4>
              <p className="text-xs text-gray-500">Nội thành TP.HCM</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="font-bold text-gray-900">Miễn phí vận chuyển</h4>
              <p className="text-xs text-gray-500">Đơn hàng từ 150.000đ</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center space-y-2">
              <Clock className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-bold text-gray-900">Giao hàng toàn quốc</h4>
              <p className="text-xs text-gray-500">2-5 ngày làm việc</p>
            </div>
          </div>
          <h2 className="text-base font-bold text-gray-800">1. Phí vận chuyển</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Đơn hàng từ <strong>150.000đ</strong>: Miễn phí giao hàng nội thành TP.HCM</li>
            <li>Đơn hàng dưới 150.000đ: Phí giao hàng <strong>15.000đ</strong></li>
            <li>Giao hàng tỉnh: Tùy thuộc đơn vị vận chuyển (GHTK, GHN, Viettel Post)</li>
          </ul>
          <h2 className="text-base font-bold text-gray-800">2. Thời gian giao hàng</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Nội thành TP.HCM: 2-4 giờ sau khi xác nhận đơn</li>
            <li>Ngoại thành TP.HCM: 4-8 giờ</li>
            <li>Các tỉnh thành khác: 2-5 ngày làm việc</li>
          </ul>
          <h2 className="text-base font-bold text-gray-800">3. Lưu ý</h2>
          <p>Quý khách vui lòng kiểm tra hàng hóa ngay khi nhận. Nếu hàng bị hư hỏng hoặc không đúng đơn, vui lòng liên hệ Hotline <strong>1900 8888</strong> để được hỗ trợ.</p>
        </div>
      </div>
    </div>
  );
}
