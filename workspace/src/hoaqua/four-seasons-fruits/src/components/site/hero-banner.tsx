"use client";

// Hero Banner - Clean, modern with large typography and subtle animations

import Link from "next/link";
import { ArrowRight, Truck, Shield, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Float } from "@/components/ui/motion";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-orange-50/50 min-h-[85vh] flex items-center">
      {/* Subtle background shapes */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-7"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100 shadow-sm"
            >
              <Leaf className="h-4 w-4" />
              Tươi ngon mỗi ngày
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1]"
            >
              Trái cây tươi,
              <br />
              <span className="text-emerald-600">giao tận nhà</span>
              <br />
              trong 30 phút
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-600 text-lg max-w-md leading-relaxed"
            >
              Hoa quả nhập khẩu và nội địa chất lượng cao. Cam kết tươi ngon, an toàn cho sức khỏe gia đình bạn.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 active:scale-[0.98]"
              >
                Mua ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300"
              >
                Tìm hiểu thêm
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 pt-6"
            >
              {[
                { icon: Truck, text: "Giao nhanh 30 phút" },
                { icon: Shield, text: "Đảm bảo tươi" },
                { icon: Leaf, text: "100% Organic" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-sm text-gray-500">
                  <badge.icon className="h-4 w-4 text-emerald-500" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative w-[480px] h-[480px]">
              {/* Main circle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 to-orange-100/60 rounded-full" />
              <div className="absolute inset-6 bg-gradient-to-br from-white/60 to-emerald-50/40 rounded-full" />

              {/* Floating fruits */}
              <Float duration={3}>
                <div className="absolute top-6 left-1/3 text-5xl drop-shadow-md">🍊</div>
              </Float>
              <Float duration={3.5}>
                <div className="absolute top-20 right-10 text-4xl drop-shadow-md">🍇</div>
              </Float>
              <Float duration={4}>
                <div className="absolute top-1/3 left-4 text-4xl drop-shadow-md">🥝</div>
              </Float>
              <Float duration={2.8}>
                <div className="absolute bottom-1/3 right-6 text-5xl drop-shadow-md">🍓</div>
              </Float>
              <Float duration={3.2}>
                <div className="absolute bottom-20 left-12 text-4xl drop-shadow-md">🥭</div>
              </Float>
              <Float duration={3.8}>
                <div className="absolute bottom-10 right-1/4 text-4xl drop-shadow-md">🍎</div>
              </Float>

              {/* Center basket */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Float duration={4}>
                  <span className="text-[100px] drop-shadow-xl">🧺</span>
                </Float>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
