'use client';
import { Smartphone, QrCode } from 'lucide-react';

export default function AppDownload() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Phone mockup */}
        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 flex-shrink-0">
          <Smartphone className="w-12 h-12 md:w-14 md:h-14 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black mb-2">Tải App TạpHóa</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-md">
            Mua sắm nhanh hơn, nhận thông báo khuyến mãi tức thì và tích điểm đổi quà với ứng dụng TạpHóa.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <button className="bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              App Store
            </button>
            <button className="bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M3.18 23.76c-.36-.17-.56-.44-.6-.82L1.36 12.32l1.22-10.6c.04-.38.24-.66.6-.82.36-.16.7-.1 1.02.18l8.32 5.76L20.84.52c.32-.28.66-.34 1.02-.18.36.16.56.44.6.82L21.24 11.78l1.22 10.6c.04.38-.24.66-.6.82-.36.16-.7.1-1.02-.18l-8.32-5.76-8.32 5.76c-.32.28-.66.34-1.02.18z"/>
              </svg>
              Google Play
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center">
            <QrCode className="w-16 h-16 text-gray-800" />
          </div>
          <span className="text-xs text-gray-500">Quét mã QR</span>
        </div>
      </div>
    </section>
  );
}
