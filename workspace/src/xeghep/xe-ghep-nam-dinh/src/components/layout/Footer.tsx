"use client";

import { Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";
import FadeIn from "../animations/FadeIn";

export default function Footer() {
  return (
    <footer id="lien-he" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <FadeIn delay={0}>
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Xe Ghép Nam Định</h3>
              <p className="text-sm mb-4 text-gray-400">
                Dịch vụ xe ghép Nam Định Hà Nội, Nội Bài. Đưa đón tận nhà, giá trọn gói, xe đời mới.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-blue-400" />
                  <span>Ngã tư bưu điện, TT Giao Thủy, Nam Định</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-blue-400" />
                  <span>Số 2A Văn Cao, P. Thụy Khê, Q. Tây Hồ, Hà Nội</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="shrink-0 text-blue-400" />
                  <a href="tel:0379803990" className="hover:text-white">0379.803.990</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="shrink-0 text-blue-400" />
                  <span>contact@xeghepnamdinh.vn</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Services */}
          <FadeIn delay={0.1}>
            <div>
              <h4 className="text-white font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Xe ghép Nam Định</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Xe ghép Nội Bài</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Vận chuyển hàng hoá</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Gửi hàng siêu tốc</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Thuê xe bán tải</Link></li>
              </ul>
            </div>
          </FadeIn>

          {/* Info */}
          <FadeIn delay={0.2}>
            <div>
              <h4 className="text-white font-semibold mb-4">Thông tin</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white transition-colors">Tin tức</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="#lien-he" className="hover:text-white transition-colors">Liên hệ</Link></li>
              </ul>
            </div>
          </FadeIn>

          {/* Hotline */}
          <FadeIn delay={0.3}>
            <div>
              <h4 className="text-white font-semibold mb-4">Đặt xe ngay</h4>
              <a
                href="tel:0379803990"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-shadow"
              >
                <Phone size={18} />
                0379.803.990
              </a>
              <p className="mt-3 text-sm text-gray-400">Phục vụ 24/7, đặt xe mọi lúc mọi nơi</p>
              <a
                href="https://zalo.me/0379803990"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Chat Zalo
              </a>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Xe Ghép Nam Định. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
