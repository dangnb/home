"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

interface ContactContentProps {
  config: Record<string, string>;
}

export default function ContactContent({ config }: ContactContentProps) {
  const hotline = config.hotline || "0379803990";
  const hotline2 = config.hotline_2 || "0345076789";
  const email = config.email || "info@xeghepnamdinh.vn";
  const address1 = config.address_1 || "Ngã tư bưu điện, TT Giao Thủy, Nam Định";
  const address2 = config.address_2 || "Số 2A Văn Cao, P. Thụy Khê, Q. Tây Hồ, Hà Nội";
  const companyName = config.company_name || "CÔNG TY CỔ PHẦN THƯƠNG MẠI DỊCH VỤ XE GHÉP NAM ĐỊNH";
  const zaloLink = config.zalo_link || "https://zalo.me/0379803990";
  const mapEmbed = config.map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473!2d105.8!3d21.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAzJzAwLjAiTiAxMDXCsDQ4JzAwLjAiRQ!5e0!3m2!1svi!2s!4v1";

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Liên hệ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 uppercase">
            Liên Hệ
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  MAPS
                </h2>
              </div>
              <div className="aspect-[4/3] w-full">
                <iframe
                  src={mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Xe Ghép Nam Định - Bản đồ"
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  THÔNG TIN LIÊN HỆ
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Company Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-blue-700 uppercase leading-snug">
                    {companyName}
                  </h3>
                </motion.div>

                {/* Hotline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hotline:</p>
                    <a href={`tel:${hotline2}`} className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                      {hotline2.replace(/(\d{4})(\d{2})(\d{4})/, "$1 $2 $3")}
                    </a>
                    <span className="mx-2 text-gray-300">|</span>
                    <a href={`tel:${hotline}`} className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                      {hotline.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3")}
                    </a>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email:</p>
                    <a href={`mailto:${email}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {email}
                    </a>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trụ sở chính:</p>
                    <p className="font-medium text-gray-900">{address2}</p>
                    <p className="text-sm text-gray-600 mt-1">VP Nam Định: {address1}</p>
                  </div>
                </motion.div>

                {/* Working hours */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ làm việc:</p>
                    <p className="font-medium text-gray-900">24/7 - Phục vụ mọi lúc mọi nơi</p>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4 border-t"
                >
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <strong className="text-blue-700">Xe Ghép Nam Định</strong>, luôn đảm bảo chất lượng dịch vụ uy tín với giá tốt nhất. 
                    Tài xế lái xe nhiều năm kinh nghiệm. Lái xe an toàn, Vui vẻ, Nhiệt tình, hỗ trợ tư vấn – báo giá 24/7, 
                    chuyên tuyến Nam Định, Hà Nội và Sân Bay Nội Bài.
                  </p>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-3 pt-4"
                >
                  <a
                    href="#"
                    className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
                    aria-label="Facebook"
                  >
                    FB
                  </a>
                  <a
                    href={zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Zalo"
                  >
                    <MessageCircle size={16} />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
                    aria-label="TikTok"
                  >
                    TT
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-xs font-bold"
                    aria-label="YouTube"
                  >
                    YT
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập họ tên..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập số điện thoại..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập email..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Chủ đề liên hệ..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={5}
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
