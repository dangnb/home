import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, Building2, Users } from 'lucide-react';

export default function GioiThieuPage() {
  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">Giới thiệu</span>
      </nav>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#00904a] to-[#006633] text-white p-8 md:p-12">
          <h1 className="text-2xl md:text-3xl font-black mb-3">Về Webtaphoa.vn</h1>
          <p className="text-white/80 text-sm max-w-xl leading-relaxed">
            Chuỗi Tạp Hóa Việt - Chuyên Sỉ Và Lẻ hàng hóa thiết yếu cho mọi gia đình Việt Nam.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-green-50 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-[#00904a] text-white rounded-xl flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">4816+</h3>
              <p className="text-gray-500 text-xs">Cửa hàng tạp hóa liên kết tại TP.HCM</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">50.000+</h3>
              <p className="text-gray-500 text-xs">Khách hàng tin tưởng sử dụng dịch vụ</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">10.000+</h3>
              <p className="text-gray-500 text-xs">Sản phẩm đa dạng từ các nhà cung cấp uy tín</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900">Câu chuyện của chúng tôi</h2>
          <p>
            Webtaphoa.vn được thành lập với sứ mệnh kết nối hơn 4.816 cửa hàng tạp hóa trên địa bàn Thành phố Hồ Chí Minh,
            mang đến cho quý khách hàng những hàng hóa thiết yếu với giá cả hợp lý nhất. Chúng tôi cam kết phục vụ
            tốt nhất nhu cầu tiêu dùng hàng ngày cho mọi gia đình Việt.
          </p>

          <h2 className="text-lg font-bold text-gray-900">Tầm nhìn & Sứ mệnh</h2>
          <p>
            Chúng tôi hướng tới trở thành hệ thống phân phối tạp hóa trực tuyến hàng đầu Việt Nam, với mạng lưới
            phủ rộng khắp 63 tỉnh thành. Sứ mệnh của Webtaphoa.vn là giúp mọi gia đình Việt tiếp cận hàng hóa
            thiết yếu chất lượng với giá tốt nhất, giao hàng nhanh chóng tận nhà.
          </p>

          <h2 className="text-lg font-bold text-gray-900">Cam kết chất lượng</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>100% hàng hóa chính hãng từ các thương hiệu uy tín</li>
            <li>Giá cả minh bạch, cạnh tranh với thị trường</li>
            <li>Giao hàng nhanh chóng trong vòng 2-4 giờ nội thành TP.HCM</li>
            <li>Chính sách đổi trả linh hoạt, bảo vệ quyền lợi người tiêu dùng</li>
            <li>Hỗ trợ đa dạng phương thức thanh toán an toàn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
