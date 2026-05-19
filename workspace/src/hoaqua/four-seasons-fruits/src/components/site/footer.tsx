"use client";

// Footer - Clean minimal design with newsletter signup

import { Leaf } from "lucide-react";
import Link from "next/link";
import { FadeUp } from "@/components/ui/motion";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t" id="contact">
      <div className="container mx-auto px-4 py-16">
        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span className="text-lg font-bold text-gray-900">FourSeasons</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Giao hàng thực phẩm sạch, hữu cơ tận nhà trong 30 phút. Chất lượng hàng đầu cho sức khỏe gia đình bạn.
              </p>
            </div>

            {/* About Us */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Về chúng tôi</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/#about", label: "Câu chuyện" },
                  { href: "/#about", label: "Nông nghiệp hữu cơ" },
                  { href: "/#about", label: "Tuyển dụng" },
                  { href: "/#about", label: "Phát triển bền vững" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Hỗ trợ</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/#contact", label: "Liên hệ hỗ trợ" },
                  { href: "/#contact", label: "Câu hỏi giao hàng" },
                  { href: "/#contact", label: "Chính sách đổi trả" },
                  { href: "/#contact", label: "Điều khoản dịch vụ" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Nhận tin mới</h3>
              <p className="text-gray-600 text-sm mb-4">
                Đăng ký để nhận thông tin ưu đãi và sản phẩm mới.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </FadeUp>

        {/* Bottom bar */}
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 FourSeasons Fruits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
