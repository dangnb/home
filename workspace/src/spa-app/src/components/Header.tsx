'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, ChevronDown, Phone, MapPin, Clock, Sparkles, Flower2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const t = useTranslations('Navigation');
  const tCat = useTranslations('ServiceCategories');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Ngọc Hương Spa & Clinic',
    phone: '090 296 0757',
    address: '79 đường 3/2, Quận 10, TP.HCM',
    facebook: 'https://facebook.com'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(prev => ({ ...prev, ...data.data }));
        }
      });
  }, []);
  
  const categories = [
    'body-care', 'facial-care', 'herbal-hair-wash', 'eye-care',
    'rf-weight-loss', 'traditional-medicine-skin-care', 'acne-treatment',
    'melasma-treatment', 'safe-skin-whitening', 'full-body-massage',
    'permanent-hair-removal', 'cosmetic-tattooing', 'acne-treatment-process', 'waxing'
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcf9f5]/92 backdrop-blur-md shadow-[0_6px_30px_-10px_rgba(110,80,75,0.08)] border-b border-[#efe6dd]">
      {/* Soft Botanical Top Bar */}
      <div className="hidden md:block bg-[#f4ece1] text-[#5c4a46] text-sm py-2 border-b border-[#eadfd3]">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8 font-normal">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9e5a6b]" />
              {settings.address}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9e5a6b]" />
              08:30 - 20:30 ({locale === 'vi' ? 'Mỗi ngày' : 'Daily'})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 font-semibold text-sm text-[#9e5a6b] hover:text-[#7d4352] transition-colors">
              <Phone className="w-4 h-4" />
              {locale === 'vi' ? 'Tư vấn miễn phí:' : 'Hotline:'} <span className="underline decoration-[#c8a46e] underline-offset-4">{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
          <div className="w-13 h-13 bg-[#f7eef0] border border-[#e6d3d8] rounded-full flex items-center justify-center text-[#9e5a6b] shadow-xs group-hover:scale-105 group-hover:bg-[#9e5a6b] group-hover:text-white transition-all duration-300">
            <Flower2 className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-2xl md:text-[26px] text-[#4a353b] tracking-tight leading-none">
              Ngọc Hương
            </span>
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#9e5a6b] font-medium mt-1.5">
              Natural Spa &amp; Clinic
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link href="/" className="text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] whitespace-nowrap">{t('home')}</Link>
          <div className="relative group">
            <Link href="/#services" className="flex items-center gap-1.5 text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] py-8 whitespace-nowrap">
              {t('services')}
              <ChevronDown className="w-4 h-4 text-[#9e5a6b]/70 transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            
            {/* Soft Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#fcf9f5] rounded-[2rem] shadow-[0_24px_60px_-15px_rgba(90,65,60,0.16)] border border-[#efe6dd] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-8 z-50 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e5a6b] mb-4 pb-3 border-b border-[#efe6dd]">
                <Sparkles className="w-4 h-4 text-[#c8a46e]" />
                {locale === 'vi' ? 'Danh Mục Liệu Trình Tự Nhiên & Chuyên Sâu' : 'Specialized Treatment Categories'}
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat} 
                    href={`/category/${cat}`} 
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#f5ede3]/70 text-[#4a3b38] hover:text-[#9e5a6b] transition-colors group/item"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#c8a46e] group-hover/item:bg-[#9e5a6b] group-hover/item:scale-125 transition-all flex-shrink-0"></div>
                    <span className="font-medium text-base leading-snug">{tCat(cat as any)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/products" className="text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] whitespace-nowrap">{t('products')}</Link>
          <Link href="/training" className="text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] whitespace-nowrap">{t('training')}</Link>
          <Link href="/careers" className="text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] whitespace-nowrap">{t('careers')}</Link>
          <Link href="/#about" className="text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] whitespace-nowrap">{t('about')}</Link>
          <Link href="/#gallery" className="text-[#4a3b38] hover:text-[#9e5a6b] transition-colors font-medium text-[17px] whitespace-nowrap">{t('gallery')}</Link>
        </nav>

        <div className="flex items-center gap-3.5 flex-shrink-0">
          <LanguageSwitcher />
          <a
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-2 bg-[#9e5a6b] hover:bg-[#874959] text-white text-base font-medium px-6 py-2.5 rounded-full shadow-[0_8px_20px_-6px_rgba(158,90,107,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(158,90,107,0.5)] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            {locale === 'vi' ? 'Đặt lịch thư giãn' : 'Book Appointment'}
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#4a3b38] p-2.5 rounded-full hover:bg-[#f4ece1] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fcf9f5] border-t border-[#efe6dd] px-6 py-5 space-y-2.5 shadow-xl">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('home')}</Link>
          <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('services')}</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('products')}</Link>
          <Link href="/training" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('training')}</Link>
          <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('careers')}</Link>
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('about')}</Link>
          <Link href="/#gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg text-[#4a3b38] font-medium hover:text-[#9e5a6b]">{t('gallery')}</Link>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-base text-center rounded-full bg-[#9e5a6b] text-white font-medium mt-2">{t('contact')}</Link>
        </div>
      )}
    </header>
  );
}
