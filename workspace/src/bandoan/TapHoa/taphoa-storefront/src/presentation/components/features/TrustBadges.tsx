import { ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export function TrustBadges() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-xs md:text-sm">Giao hàng 2 giờ</h4>
          <p className="text-[11px] text-gray-500">Miễn phí ship đơn từ 150k</p>
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-xs md:text-sm">100% Sạch & Tươi</h4>
          <p className="text-[11px] text-gray-500">Tiêu chuẩn VietGAP an toàn</p>
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-xs md:text-sm">Đổi trả 7 ngày</h4>
          <p className="text-[11px] text-gray-500">Hoàn tiền nếu không hài lòng</p>
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-xs md:text-sm">Giá cả minh bạch</h4>
          <p className="text-[11px] text-gray-500">Nhiều ưu đãi mỗi tuần</p>
        </div>
      </div>
    </section>
  );
}
