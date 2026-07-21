'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-black text-emerald-400 tracking-tight">
              Tạp<span className="text-white">Hóa</span>
            </Link>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Nền tảng mua sắm thực phẩm tươi sống trực tuyến hàng đầu. Tươi ngon mỗi ngày, giao nhanh 2 giờ.
            </p>
            <div className="flex gap-3 mt-4">
              {['Facebook', 'Zalo', 'TikTok'].map((name) => (
                <span key={name} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                  {name[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Trang chủ', href: '/' },
                { label: 'Tìm kiếm', href: '/search' },
                { label: 'Giỏ hàng', href: '/cart' },
                { label: 'Yêu thích', href: '/wishlist' },
                { label: 'Tra cứu đơn hàng', href: '/tracking' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wider">Thông tin</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Về chúng tôi', href: '/about' },
                { label: 'Liên hệ', href: '/contact' },
                { label: 'Chính sách giao hàng', href: '#' },
                { label: 'Chính sách đổi trả', href: '#' },
                { label: 'Điều khoản sử dụng', href: '#' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                123 Nguyễn Huệ, Q.1, TP.HCM
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                1900 1234
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                support@taphoa.vn
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                6:00 - 22:00 hàng ngày
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© 2026 TạpHóa. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Thanh toán:</span>
            <div className="flex gap-2">
              {['VISA', 'MC', 'MOMO', 'COD'].map(m => (
                <span key={m} className="bg-gray-800 text-[10px] font-bold text-gray-400 px-2 py-1 rounded">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
