'use client';

import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t-4 border-emerald-500">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">TriKun FastFood</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thương hiệu Đồ ăn nhanh số 1 với nguyên liệu tươi ngon mỗi ngày, chuẩn vị đắm say, giao hàng siêu tốc 15 phút.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-bold">
              <Clock className="w-4 h-4" />
              <span>Phục vụ từ: 07:00 - 23:00 hàng ngày</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-white mb-3 text-base">Danh mục Hot</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li className="hover:text-emerald-400 transition cursor-pointer">Gà rán giòn rụm</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Burger Bò Phô mai kép</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Combo Tiệc Gà Độc Quyền</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Trà sữa trân châu đường đen</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Bánh Tiramisu Ý</li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-extrabold text-white mb-3 text-base">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li className="hover:text-emerald-400 transition cursor-pointer">Chính sách giao hàng 15 phút</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Chính sách an toàn thực phẩm</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Điều khoản sử dụng dịch vụ</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Hướng dẫn đặt hàng online</li>
              <li className="hover:text-emerald-400 transition cursor-pointer">Liên hệ hợp tác nhượng quyền</li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="font-extrabold text-white mb-3 text-base">Liên hệ với chúng tôi</h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>123 Đường Lê Minh Trí, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-bold text-white">Hotline: 1900 6868</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>cskh@trikunfastfood.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 TriKun FastFood. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> cho trải nghiệm ẩm thực hoàn hảo
          </p>
        </div>
      </div>
    </footer>
  );
}
