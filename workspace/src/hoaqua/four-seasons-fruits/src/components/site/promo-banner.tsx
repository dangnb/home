"use client";

// Promotional Banner - Green rounded card with CTA
// Inspired by FreshMarket's "Free delivery" banner

import Link from "next/link";
import { FadeUp } from "@/components/ui/motion";

export function PromoBanner() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 p-8 md:p-12 lg:p-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Giao hàng miễn phí cho đơn đầu tiên!
                </h2>
                <p className="text-emerald-100 mt-4 text-base md:text-lg">
                  Nhập mã <span className="font-bold text-white bg-emerald-800/50 px-2 py-0.5 rounded">FRESHNEW</span> để được hưởng ưu đãi giao hàng miễn phí trong vòng 30 phút.
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-6 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-full hover:bg-gray-50 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                >
                  Đặt Ngay
                </Link>
              </div>

              {/* Decorative Image */}
              <div className="hidden md:flex justify-center">
                <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                  <div className="absolute inset-0 bg-emerald-500/30 rounded-full" />
                  <div className="absolute inset-4 bg-emerald-400/20 rounded-full flex items-center justify-center">
                    <span className="text-[100px] lg:text-[120px]">🧺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
