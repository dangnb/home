'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Flower2,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('HomePage.hero');
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides =
    locale === 'vi'
      ? [
          {
            id: '01',
            badge: 'Tinh Hoa Trị Liệu Tự Nhiên',
            title: t('heading'),
            subtitle: t('subheading'),
            mainImage: '/spa_hero_natural.png',
            subImage: '/spa_gallery.png',
            highlightTag: 'Liệu trình Signature • 90 phút',
            highlightSub: 'Thư giãn cổ vai gáy & Dưỡng sáng thảo mộc',
            ctaLink: '#contact',
            ctaText: t('cta'),
          },
          {
            id: '02',
            badge: 'Chăm Sóc Da Chuẩn Y Khoa',
            title: 'Phục Hồi & Trẻ Hóa Làn Da Từ Thảo Mộc Quý',
            subtitle:
              'Kết hợp tinh chất thảo dược Đông Y thuần khiết cùng phác đồ cá nhân hóa 1:1, giúp tái tạo làn da căng bóng, mịn màng tự nhiên.',
            mainImage: '/spa_service.png',
            subImage: '/spa_hero_natural.png',
            highlightTag: 'Soi da & Phác đồ 1:1',
            highlightSub: 'An toàn lành tính cho cả làn da nhạy cảm',
            ctaLink: '#services',
            ctaText: 'Xem các liệu trình',
          },
          {
            id: '03',
            badge: 'Dược Mỹ Phẩm Độc Quyền',
            title: 'Chắt Lọc Tinh Túy Thiên Nhiên Cho Làn Da Thuần Khiết',
            subtitle:
              'Bộ sưu tập serum, kem dưỡng và trà thảo mộc dưỡng nhan không hóa chất lột tẩy, nuôi dưỡng vẻ đẹp bền vững từ gốc.',
            mainImage: '/spa_gallery.png',
            subImage: '/spa_service.png',
            highlightTag: '100% Chiết xuất thảo mộc',
            highlightSub: 'Được kiểm định nghiêm ngặt & Bác sĩ khuyên dùng',
            ctaLink: '/products',
            ctaText: 'Khám phá sản phẩm',
          },
          {
            id: '04',
            badge: 'Không Gian Thư Giãn 5 Sao',
            title: 'Chốn Bình Yên Nuôi Dưỡng Thân – Tâm – Trí',
            subtitle:
              'Tách biệt khỏi phố thị ồn ào, đắm mình trong hương tinh dầu thảo mộc ấm áp, ánh sáng dịu nhẹ và âm nhạc trị liệu thư thái.',
            mainImage: '/spa_about.png',
            subImage: '/spa_gallery.png',
            highlightTag: 'Không gian riêng tư & Ấm cúng',
            highlightSub: 'Đội ngũ chuyên viên tận tâm, giàu kinh nghiệm',
            ctaLink: '#gallery',
            ctaText: 'Tham quan không gian',
          },
        ]
      : [
          {
            id: '01',
            badge: 'Natural Holistic Sanctuary',
            title: t('heading'),
            subtitle: t('subheading'),
            mainImage: '/spa_hero_natural.png',
            subImage: '/spa_gallery.png',
            highlightTag: 'Signature Ritual • 90 mins',
            highlightSub: 'Herbal facial glow & deep relaxation therapy',
            ctaLink: '#contact',
            ctaText: t('cta'),
          },
          {
            id: '02',
            badge: 'Clinical Botanical Care',
            title: 'Gentle Skin Rejuvenation with Pure Herbal Extracts',
            subtitle:
              'Combining traditional herbal wisdom with personalized 1:1 dermatological care for dewy, radiant, and healthy skin.',
            mainImage: '/spa_service.png',
            subImage: '/spa_hero_natural.png',
            highlightTag: '1:1 Skin Analysis',
            highlightSub: 'Gentle and safe for sensitive skin',
            ctaLink: '#services',
            ctaText: 'Explore Treatments',
          },
          {
            id: '03',
            badge: 'Botanical Skincare Collection',
            title: 'Pure Nature Distilled for Everyday Radiance',
            subtitle:
              'Discover our exclusive collection of herbal serums, nourishing creams, and wellness teas crafted for lasting beauty.',
            mainImage: '/spa_gallery.png',
            subImage: '/spa_service.png',
            highlightTag: '100% Botanical Formula',
            highlightSub: 'Dermatologist tested & paraben-free',
            ctaLink: '/products',
            ctaText: 'Shop Skincare',
          },
          {
            id: '04',
            badge: '5-Star Serene Space',
            title: 'A Peaceful Sanctuary for Body, Mind & Soul',
            subtitle:
              'Step away from the busy city into warm aromatherapy scents, soft natural light, and deeply restorative touch.',
            mainImage: '/spa_about.png',
            subImage: '/spa_gallery.png',
            highlightTag: 'Private & Cozy Suites',
            highlightSub: 'Dedicated and experienced therapists',
            ctaLink: '#gallery',
            ctaText: 'View Our Space',
          },
        ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const active = slides[currentSlide];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const stats =
    locale === 'vi'
      ? [
          { icon: Award, value: '12+ Năm', label: 'Tinh hoa trị liệu & Thẩm mỹ tự nhiên' },
          { icon: Users, value: '50.000+', label: 'Khách hàng thư giãn & Hài lòng' },
          { icon: ShieldCheck, value: '100%', label: 'Thảo mộc thiên nhiên lành tính' },
        ]
      : [
          { icon: Award, value: '12+ Years', label: 'Holistic & Natural Spa Excellence' },
          { icon: Users, value: '50,000+', label: 'Relaxed & Happy Clients' },
          { icon: ShieldCheck, value: '100%', label: 'Pure Botanical & Gentle Care' },
        ];

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#fcf9f5] via-[#f6efe6] to-[#f7eef0] pt-8 pb-14 md:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Soft Organic Ambient Light Blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#9e5a6b]/8 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-[30rem] h-[30rem] rounded-full bg-[#c8a46e]/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-[#6e806b]/8 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Text & Interactive Slide Switcher */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#ead6db] text-[#9e5a6b] text-xs md:text-sm font-medium tracking-[0.18em] uppercase mb-6 shadow-xs">
                  <Flower2 className="w-4 h-4 text-[#9e5a6b]" />
                  <span>{active.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl xl:text-[54px] font-semibold text-[#3d312e] mb-6 tracking-tight leading-[1.18]">
                  {active.title}
                </h1>

                <p className="text-base md:text-lg text-[#6e5c57] mb-9 max-w-2xl leading-relaxed">
                  {active.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                  {active.ctaLink.startsWith('/') ? (
                    <Link
                      href={active.ctaLink}
                      className="inline-flex items-center gap-2.5 bg-[#9e5a6b] text-white px-8 py-4 rounded-full font-medium text-base md:text-lg shadow-[0_12px_28px_-6px_rgba(158,90,107,0.45)] hover:bg-[#874959] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Calendar className="w-5 h-5" />
                      {active.ctaText}
                    </Link>
                  ) : (
                    <a
                      href={active.ctaLink}
                      className="inline-flex items-center gap-2.5 bg-[#9e5a6b] text-white px-8 py-4 rounded-full font-medium text-base md:text-lg shadow-[0_12px_28px_-6px_rgba(158,90,107,0.45)] hover:bg-[#874959] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Calendar className="w-5 h-5" />
                      {active.ctaText}
                    </a>
                  )}

                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 bg-white/90 text-[#4a353b] px-7 py-4 rounded-full font-medium text-base md:text-lg border border-[#e6dcd2] hover:border-[#9e5a6b] hover:text-[#9e5a6b] transition-all duration-300 shadow-xs"
                  >
                    {locale === 'vi' ? 'Bảng giá & Liệu trình' : 'View Treatments'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Interactive Thumbnail / Story Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#eadfd3]">
              {slides.map((s, idx) => {
                const isSelected = idx === currentSlide;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`text-left p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white border-[#d8bfc5] shadow-[0_8px_24px_-8px_rgba(158,90,107,0.18)]'
                        : 'bg-white/50 border-[#efe6dd] hover:bg-white/80'
                    }`}
                  >
                    <img
                      src={s.mainImage}
                      alt={s.badge}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-[#efe6dd]"
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          isSelected ? 'text-[#9e5a6b]' : 'text-[#9c8982]'
                        }`}
                      >
                        {s.id}
                      </div>
                      <div className="text-xs font-medium text-[#3d312e] truncate">
                        {s.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Multi-Layered Botanical Arch Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[440px] mx-auto">
              {/* Decorative Offset Arch Line */}
              <div className="absolute -inset-3 rounded-t-[13rem] rounded-b-[2.75rem] border border-[#dfc9cf] rotate-2 pointer-events-none" />
              <div className="absolute -inset-3 rounded-t-[13rem] rounded-b-[2.75rem] bg-[#f4ece1]/70 -rotate-2 -z-10 pointer-events-none" />

              {/* Main Arched Slide Photo (Crystal Clear, No Muddy Overlay) */}
              <div className="relative h-[460px] sm:h-[510px] w-full rounded-t-[12rem] rounded-b-[2.5rem] overflow-hidden border-[6px] border-white shadow-[0_24px_60px_-15px_rgba(90,60,55,0.22)] bg-[#f4ece1]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active.mainImage}
                    src={active.mainImage}
                    alt={active.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </AnimatePresence>

                {/* Subtle bottom gradient only for caption readability */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#2e201e]/60 via-[#2e201e]/20 to-transparent" />

                {/* Top Right Floating Pill Tag */}
                <div className="absolute top-5 right-5 bg-white/92 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#efe6dd] shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" />
                  <span className="text-xs font-medium text-[#4a353b]">{active.highlightTag}</span>
                </div>

                {/* Bottom Caption & Prev/Next Controls inside Arch */}
                <div className="absolute bottom-4 inset-x-5 flex items-end justify-between gap-3 text-white">
                  <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-2.5 flex-1">
                    <div className="flex items-center gap-1 text-[#f5d996] text-xs mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#f5d996] text-[#f5d996]" />
                      ))}
                      <span className="text-white/90 font-medium ml-1">4.9/5</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                      {active.highlightSub}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#3d312e] flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#3d312e] flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Secondary Detail Image Card (Bottom Left) */}
              <motion.div
                key={`sub-${active.id}`}
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="hidden sm:block absolute -bottom-6 -left-10 w-34 h-34 rounded-[1.75rem] overflow-hidden border-4 border-white shadow-[0_16px_36px_-8px_rgba(90,60,55,0.22)] bg-[#fcf9f5]"
              >
                <img
                  src={active.subImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Soft Ivory Highlights Bar */}
        <div className="mt-14 bg-white/90 backdrop-blur-md rounded-[2rem] border border-[#efe6dd] shadow-[0_14px_40px_-15px_rgba(110,80,75,0.1)] px-6 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f7eef0] border border-[#ead6db] flex items-center justify-center text-[#9e5a6b] flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-[#4a353b]">{item.value}</div>
                  <div className="text-sm text-[#7a6863]">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
