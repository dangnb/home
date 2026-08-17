import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Youtube, MessageCircle, CreditCard, Banknote, Wallet, Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 text-xs">
      {/* Pre-footer CTA */}
      <div className="bg-gradient-to-r from-[#00904a] to-[#00b35a]">
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="font-extrabold text-base">Đăng ký nhận khuyến mãi</h3>
            <p className="text-white/70 text-[11px] mt-0.5">Nhận ngay voucher <b className="text-yellow-200">50.000₫</b> cho đơn hàng đầu tiên!</p>
          </div>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-4 py-2.5 bg-white/10 backdrop-blur border border-white/20 rounded-l-lg text-white text-xs placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
            />
            <button className="px-6 py-2.5 bg-white text-[#00904a] text-xs font-extrabold rounded-r-lg hover:bg-yellow-50 transition-colors whitespace-nowrap">
              ĐĂNG KÝ NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-4 pt-10 pb-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="text-xl font-black text-white tracking-tight">
              Web<span className="text-[#00904a]">taphoa</span>.vn
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Chuỗi Tạp Hóa Việt - Chuyên Sỉ Và Lẻ. Phục vụ tốt nhất nhu cầu khách hàng với giá cả hợp lý nhất.
            </p>
            <div className="space-y-2 text-gray-400 text-[11px]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00904a] flex-shrink-0 mt-0.5" />
                <span>123 Đường Nguyễn Huệ, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00904a] flex-shrink-0" />
                <span>Hotline: <b className="text-white">1900 8888</b></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00904a] flex-shrink-0" />
                <span>cskh@webtaphoa.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#00904a] flex-shrink-0" />
                <span>7:00 - 22:00 mỗi ngày</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-white text-[13px] uppercase tracking-wider">Danh mục</h4>
            <ul className="space-y-2 text-gray-400 text-[11px]">
              {[
                { href: '/collections/goc-que-nha', label: 'Góc Quê Nhà' },
                { href: '/collections/goc-nau-an', label: 'Góc Nấu Ăn' },
                { href: '/collections/goc-thuc-pham', label: 'Góc Thực Phẩm' },
                { href: '/collections/goc-sach-dep', label: 'Góc Sạch Đẹp' },
                { href: '/collections/goc-me-va-be', label: 'Góc Mẹ Và Bé' },
                { href: '/collections/goc-phai-dep', label: 'Góc Phái Đẹp' },
                { href: '/collections/goc-dien-may', label: 'Góc Điện Máy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#00904a] hover:pl-1 transition-all">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-white text-[13px] uppercase tracking-wider">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400 text-[11px]">
              {[
                { href: '/pages/gioi-thieu', label: 'Giới thiệu' },
                { href: '/pages/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
                { href: '/pages/chinh-sach-doi-tra', label: 'Chính sách đổi trả' },
                { href: '/pages/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
                { href: '/pages/huong-dan-thanh-toan', label: 'Hướng dẫn thanh toán' },
                { href: '/tracking', label: 'Tra cứu đơn hàng' },
                { href: '/pages/lien-he', label: 'Liên hệ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#00904a] hover:pl-1 transition-all">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Social */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-white text-[13px] uppercase tracking-wider">Thanh toán</h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <Banknote className="w-4 h-4" />, label: 'COD', color: 'text-green-400' },
                { icon: <Wallet className="w-4 h-4" />, label: 'MoMo', color: 'text-pink-400' },
                { icon: <CreditCard className="w-4 h-4" />, label: 'VNPay', color: 'text-blue-400' },
                { icon: <Building2 className="w-4 h-4" />, label: 'Bank', color: 'text-cyan-400' },
              ].map((pm, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <span className={pm.color}>{pm.icon}</span>
                  <span className="text-[9px] font-bold text-gray-400">{pm.label}</span>
                </div>
              ))}
            </div>

            <h4 className="font-extrabold text-white text-[13px] uppercase tracking-wider pt-2">Kết nối</h4>
            <div className="flex gap-2">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#1877f2] border border-white/10 rounded-xl flex items-center justify-center transition-all hover:border-transparent hover:scale-110">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#0088cc] border border-white/10 rounded-xl flex items-center justify-center transition-all hover:border-transparent hover:scale-110">
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#ff0000] border border-white/10 rounded-xl flex items-center justify-center transition-all hover:border-transparent hover:scale-110">
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-gray-500 text-[10px]">
          <span>© 2024 Webtaphoa.vn – Chuỗi Tạp Hóa Việt. All rights reserved.</span>
          <span>GPKD số: 0316XXXXXX do Sở KH&ĐT TP.HCM cấp ngày 01/01/2024</span>
        </div>
      </div>
    </footer>
  );
}
