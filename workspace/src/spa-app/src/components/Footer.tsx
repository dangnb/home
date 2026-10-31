import { getTranslations } from 'next-intl/server';
import { readDb } from '@/lib/db';
import { Phone, Mail, MapPin, Clock, Flower2 } from 'lucide-react';

export default async function Footer() {
  const t = await getTranslations('Navigation');
  const settings = (await readDb('settings')) || {};
  const siteName = settings.siteName || 'Ngọc Hương Spa & Clinic';
  const phone = settings.phone || '090 296 0757';
  const email = settings.email || 'contact@ngochuongspa.vn';
  const address = settings.address || '79 đường 3/2, Quận 10, TP.HCM';
  const facebook = settings.facebook || 'https://facebook.com';

  return (
    <footer className="bg-[#3a2e2b] text-[#f5ede3] pt-16 pb-10 border-t border-[#4f3f3b]">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-13 h-13 bg-[#4d3d39] border border-[#6b5650] rounded-full flex items-center justify-center text-[#e5c590] shadow-xs">
              <Flower2 className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <span className="font-semibold text-2xl text-white tracking-tight block leading-none">{siteName}</span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#e5c590] font-medium mt-1.5 block">Natural Sanctuary &amp; Holistic Spa</span>
            </div>
          </div>
          <p className="text-[#d8cbc4] max-w-md leading-relaxed mb-6 text-base">
            Đánh thức vẻ đẹp nguyên bản và sự thư thái tâm hồn với liệu trình chăm sóc da thảo mộc tự nhiên kết hợp liệu pháp trị liệu nhẹ nhàng, chuẩn Y khoa.
          </p>
          <div className="flex gap-3">
            <a href={facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/8 border border-white/15 flex items-center justify-center hover:bg-[#9e5a6b] hover:border-[#9e5a6b] hover:-translate-y-0.5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/8 border border-white/15 flex items-center justify-center hover:bg-[#9e5a6b] hover:border-[#9e5a6b] hover:-translate-y-0.5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-6 uppercase tracking-[0.2em] text-[#e5c590]">Liên kết nhanh</h3>
          <ul className="space-y-3 text-base">
            <li><a href="/" className="text-[#d8cbc4] hover:text-white transition-colors">{t('home')}</a></li>
            <li><a href="/#services" className="text-[#d8cbc4] hover:text-white transition-colors">{t('services')}</a></li>
            <li><a href="/products" className="text-[#d8cbc4] hover:text-white transition-colors">{t('products')}</a></li>
            <li><a href="/training" className="text-[#d8cbc4] hover:text-white transition-colors">{t('training')}</a></li>
            <li><a href="/careers" className="text-[#d8cbc4] hover:text-white transition-colors">{t('careers')}</a></li>
            <li><a href="/#contact" className="text-[#d8cbc4] hover:text-white transition-colors">{t('contact')}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-6 uppercase tracking-[0.2em] text-[#e5c590]">Thông tin liên hệ</h3>
          <ul className="space-y-3.5 text-[#d8cbc4] text-base">
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#e5c590] mt-1 flex-shrink-0" />
              <span>Hotline: <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#e5c590] transition-colors font-semibold text-white">{phone}</a></span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#e5c590] mt-1 flex-shrink-0" />
              <span>{email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#e5c590] mt-1 flex-shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#e5c590] mt-1 flex-shrink-0" />
              <span>08:30 - 20:30 (Tất cả các ngày)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-white/10 text-center text-[#a6958e] text-sm">
        &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
