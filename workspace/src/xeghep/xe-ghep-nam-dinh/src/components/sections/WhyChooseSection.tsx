"use client";

import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import FadeIn from "../animations/FadeIn";
import CountUp from "../animations/CountUp";

const reasons = [
  "Cam kết 100% xe riêng đời mới, xe 4 chỗ, xe 7 chỗ",
  "Phục vụ đưa đón tận nhà, giảm chi phí đi lại",
  "Đội ngũ lái xe dày dặn kinh nghiệm, chuyên nghiệp",
  "Luôn cam kết với mức giá tốt nhất cho khách hàng",
  "Miễn phí huỷ chuyến khi thay đổi lộ trình",
  "Hoàn lại tiền 100% đến 200% về chất lượng dịch vụ",
];

const stats = [
  { value: 5, suffix: " năm", label: "Kinh nghiệm" },
  { value: 50000, suffix: "+", label: "Khách hàng" },
  { value: 100, suffix: "%", label: "Hài lòng" },
  { value: 24, suffix: "/7", label: "Phục vụ" },
];

export default function WhyChooseSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Stats */}
          <FadeIn direction="left">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-white/80 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Right - Content */}
          <FadeIn direction="right">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Vì Sao Chọn{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                  Xe Ghép Nam Định?
                </span>
              </h2>
              <ul className="mt-8 space-y-4">
                {reasons.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-green-400" />
                    </div>
                    <span className="text-white/90">{reason}</span>
                  </motion.li>
                ))}
              </ul>
              <a
                href="tel:0379803990"
                className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105"
              >
                <Phone size={20} />
                Đặt xe ngay: 0379.803.990
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
