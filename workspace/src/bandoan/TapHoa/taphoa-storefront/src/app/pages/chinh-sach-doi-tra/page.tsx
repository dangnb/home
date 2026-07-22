import Link from 'next/link';
import { RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ChinhSachDoiTraPage() {
  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link><span>/</span>
        <span className="text-gray-800 font-semibold">Chính sách đổi trả</span>
      </nav>
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 space-y-5">
        <h1 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Chính Sách Đổi Trả</h1>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <h2 className="text-base font-bold text-gray-800">1. Điều kiện đổi trả</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Sản phẩm còn nguyên bao bì, chưa qua sử dụng</li>
            <li>Thời hạn đổi trả: trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng</li>
            <li>Sản phẩm bị lỗi do nhà sản xuất hoặc giao sai đơn hàng</li>
          </ul>
          <h2 className="text-base font-bold text-gray-800">2. Trường hợp KHÔNG áp dụng đổi trả</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Sản phẩm thực phẩm đã mở nắp / bao bì</li>
            <li>Sản phẩm hư hỏng do người mua gây ra</li>
            <li>Quá thời hạn 7 ngày đổi trả</li>
          </ul>
          <h2 className="text-base font-bold text-gray-800">3. Quy trình đổi trả</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Liên hệ Hotline 1900 8888 hoặc email cskh@webtaphoa.vn</li>
            <li>Cung cấp mã đơn hàng, ảnh chụp sản phẩm lỗi</li>
            <li>Nhân viên CSKH xác nhận và hướng dẫn gửi trả</li>
            <li>Hoàn tiền hoặc đổi sản phẩm mới trong 3-5 ngày làm việc</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
