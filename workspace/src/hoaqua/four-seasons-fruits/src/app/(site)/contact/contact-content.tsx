"use client";

// Contact page content with animations

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface ContactContentProps {
  settings: Record<string, string>;
}

export function ContactContent({ settings }: ContactContentProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Liên hệ <span className="text-emerald-600">với chúng tôi</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua bất kỳ kênh nào bên dưới.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Phone */}
            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Điện thoại</h3>
                <p className="text-emerald-600 font-medium text-lg">{settings.phone}</p>
                {settings.phone_2 && (
                  <p className="text-gray-500 text-sm mt-1">{settings.phone_2}</p>
                )}
              </div>
            </StaggerItem>

            {/* Email */}
            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
                  <Mail className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">{settings.email}</p>
              </div>
            </StaggerItem>

            {/* Address */}
            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Địa chỉ</h3>
                <p className="text-gray-600 text-sm">{settings.address}</p>
              </div>
            </StaggerItem>

            {/* Working Hours */}
            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-100 transition-colors">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Giờ mở cửa</h3>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p>T2-T6: {settings.working_hours_weekday}</p>
                  <p>T7: {settings.working_hours_saturday}</p>
                  <p>CN: {settings.working_hours_sunday}</p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Map + Details */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden border shadow-sm h-[400px] bg-gray-100">
                {settings.google_map_embed ? (
                  <iframe
                    src={settings.google_map_embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Store location"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Bản đồ sẽ hiển thị khi cấu hình Google Maps Embed URL</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {settings.store_name}
                  </h2>
                  <p className="text-gray-600">{settings.store_slogan}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Địa chỉ</p>
                      <p className="text-gray-600 text-sm mt-0.5">{settings.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <Phone className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Hotline</p>
                      <p className="text-gray-600 text-sm mt-0.5">
                        {settings.phone}
                        {settings.phone_2 && ` • ${settings.phone_2}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <Mail className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Email</p>
                      <p className="text-gray-600 text-sm mt-0.5">{settings.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Giờ hoạt động</p>
                      <div className="text-gray-600 text-sm mt-0.5 space-y-0.5">
                        <p>Thứ 2 - Thứ 6: {settings.working_hours_weekday}</p>
                        <p>Thứ 7: {settings.working_hours_saturday}</p>
                        <p>Chủ nhật: {settings.working_hours_sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(settings.facebook || settings.instagram || settings.zalo) && (
                  <div>
                    <p className="font-medium text-gray-900 text-sm mb-3">Kết nối với chúng tôi</p>
                    <div className="flex gap-3">
                      {settings.facebook && (
                        <a
                          href={settings.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors text-lg font-bold"
                        >
                          f
                        </a>
                      )}
                      {settings.instagram && (
                        <a
                          href={settings.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors text-lg"
                        >
                          📷
                        </a>
                      )}
                      {settings.zalo && (
                        <a
                          href={settings.zalo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                {settings.google_map && (
                  <a
                    href={settings.google_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Xem trên Google Maps
                  </a>
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
