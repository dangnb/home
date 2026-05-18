"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Star, Shield, Clock, Car } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />

      {/* Animated circles */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6"
            >
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              Chất lượng dịch vụ 5 sao
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Xe Ghép{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                Nam Định
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-blue-100 max-w-lg"
            >
              Dịch vụ xe ghép Nam Định - Hà Nội, Nội Bài. Cam kết 100% xe riêng đời mới, đưa đón tại nhà, giá trọn gói.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {[
                { icon: Shield, text: "Xe đời mới 100%" },
                { icon: Clock, text: "Đón tận nhà 24/7" },
                { icon: Car, text: "Giá trọn gói" },
                { icon: Star, text: "Miễn phí hủy chuyến" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/90">
                  <item.icon size={18} className="text-orange-400" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="tel:0379803990"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all"
              >
                <Phone size={20} className="group-hover:animate-bounce" />
                0379.803.990
              </a>
              <a
                href="/dat-ve"
                className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
              >
                <MessageCircle size={20} />
                Đặt vé online
              </a>
            </motion.div>
          </div>

          {/* Right - Price Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h3 className="text-white font-bold text-2xl mb-6 text-center">Bảng giá nhanh</h3>
              <div className="space-y-4">
                {[
                  { route: "Hà Nội ↔ Nam Định", price: "250.000đ", unit: "/ghế" },
                  { route: "Taxi 4 chỗ HN-NĐ", price: "900.000đ", unit: "/xe" },
                  { route: "Taxi 7 chỗ HN-NĐ", price: "1.100.000đ", unit: "/xe" },
                  { route: "Nam Định ↔ Nội Bài", price: "450.000đ", unit: "/ghế" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <span className="text-white/80 text-sm">{item.route}</span>
                    <span className="text-orange-400 font-bold">
                      {item.price}
                      <span className="text-xs text-white/60">{item.unit}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
              <a
                href="/dat-ve"
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
              >
                <Phone size={18} />
                Đặt xe ngay
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
