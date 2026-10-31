import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Leaf,
  Stethoscope,
  Truck,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { readDb } from '@/lib/db';
import ProductsCatalog from '@/components/ProductsCatalog';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  
  setRequestLocale(locale);

  const t = await getTranslations('Products');
  const tNav = await getTranslations('Navigation');

  const products = (await readDb('products')) || [];

  const guarantees =
    locale === 'vi'
      ? [
          {
            icon: ShieldCheck,
            title: '100% Chính Hãng Chuẩn Y Khoa',
            desc: 'Được kiểm định nghiêm ngặt bởi Bộ Y Tế & FDA'
          },
          {
            icon: Leaf,
            title: 'Chiết Xuất Thảo Dược Quý',
            desc: 'An toàn lành tính, không Corticoid hay chất lột tẩy'
          },
          {
            icon: Stethoscope,
            title: 'Chuyên Gia Kê Đơn 1:1',
            desc: 'Phác đồ cá nhân hóa theo đúng tình trạng da'
          },
          {
            icon: Truck,
            title: 'Giao Hàng Toàn Quốc',
            desc: 'Kiểm tra hàng trước khi thanh toán, miễn phí vận chuyển'
          }
        ]
      : [
          {
            icon: ShieldCheck,
            title: '100% Authentic Clinical Grade',
            desc: 'Strictly certified for safety and efficacy'
          },
          {
            icon: Leaf,
            title: 'Natural Herbal Extracts',
            desc: 'Gentle formula, free from harsh chemicals'
          },
          {
            icon: Stethoscope,
            title: '1:1 Dermatologist Consultation',
            desc: 'Personalized regimen tailored to your skin'
          },
          {
            icon: Truck,
            title: 'Nationwide Fast Delivery',
            desc: 'Inspect upon delivery, free shipping on sets'
          }
        ];

  const routineSteps =
    locale === 'vi'
      ? [
          {
            step: '01',
            title: 'Làm Sạch Sâu & Cân Bằng',
            desc: 'Loại bỏ bụi bẩn, bã nhờn với Sữa Rửa Mặt Thảo Dược và cấp ẩm tức thì bằng Nước Hoa Hồng Cốt Yến.'
          },
          {
            step: '02',
            title: 'Đặc Trị & Tái Tạo Tế Bào',
            desc: 'Thoa Serum Tế Bào Gốc hoặc Tinh Chất Đặc Trị Nám để phục hồi cấu trúc sợi Collagen từ tầng trung bì.'
          },
          {
            step: '03',
            title: 'Khóa Ẩm & Nuôi Dưỡng Đêm',
            desc: 'Sử dụng Kem Dưỡng Ngọc Trai giúp khóa chặt dưỡng chất và nuôi dưỡng làn da trắng hồng, căng bóng.'
          },
          {
            step: '04',
            title: 'Bảo Vệ Phổ Rộng Ban Ngày',
            desc: 'Thoa Kem Chống Nắng Sinh Học SPF 50+ mỗi sáng để ngăn ngừa tia UV và chống tái phát sạm nám.'
          }
        ]
      : [
          {
            step: '01',
            title: 'Deep Cleanse & Balance',
            desc: 'Remove impurities with Herbal Cleanser and balance pH with Saffron Hydrating Toner.'
          },
          {
            step: '02',
            title: 'Targeted Cellular Repair',
            desc: 'Apply Stem Cell Recovery Serum or Melasma Essence to rebuild collagen fibers.'
          },
          {
            step: '03',
            title: '24h Moisture Lock',
            desc: 'Seal in nutrients with Pearl Whitening Cream for dewy, luminous skin.'
          },
          {
            step: '04',
            title: 'Broad-Spectrum UV Defense',
            desc: 'Protect daily with Bio-Shield SPF 50+ Sunscreen against UV and blue light.'
          }
        ];

  return (
    <main className="flex-1 w-full bg-[#fcf9f5] pb-24">
      {/* Soft Botanical Hero Banner */}
      <section className="relative w-full min-h-[42vh] md:min-h-[48vh] flex items-center justify-center overflow-hidden bg-[#f4ece1]">
        <div className="absolute inset-0 z-0">
          <img src="/spa_gallery.png" alt={t('heading')} className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a2a29]/65 via-[#4d3739]/45 to-[#3a2a29]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f5] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#efe6dd] text-[#9e5a6b] text-xs md:text-sm font-medium uppercase tracking-[0.2em] mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" />
            {locale === 'vi' ? 'Tinh Hoa Thảo Mộc & Dược Mỹ Phẩm Lành Tính' : 'Botanical & Gentle Clinical Skincare'}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight drop-shadow-xs">
            {t('heading')}
          </h1>
          <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            {t('description')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* 4 Soft Botanical Guarantee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {guarantees.map((item, i) => {
            const Icon = item.icon;
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className="bg-white/95 backdrop-blur-md p-5 rounded-[1.75rem] shadow-[0_12px_32px_-14px_rgba(110,80,75,0.1)] border border-[#efe6dd] flex items-start gap-4 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                    isEven
                      ? 'bg-[#f7eef0] border-[#ead6db] text-[#9e5a6b]'
                      : 'bg-[#eef2ed] border-[#d8e2d6] text-[#6e806b]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3d312e] text-base mb-1">{item.title}</h3>
                  <p className="text-[#7a6863] text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#7a6863] mb-8">
          <Link href="/" className="hover:text-[#9e5a6b] transition-colors font-medium">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#9e5a6b] font-semibold">{tNav('products')}</span>
        </nav>

        {/* Interactive Products Catalog */}
        <ProductsCatalog products={products} locale={locale} />

        {/* 4-Step Gentle Skincare Routine Section */}
        <FadeIn delay={0.2}>
          <section className="mt-24 bg-white rounded-[2.5rem] p-8 md:p-14 border border-[#efe6dd] shadow-[0_14px_40px_-15px_rgba(110,80,75,0.08)]">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#9e5a6b] bg-[#f7eef0] border border-[#ead6db] px-4 py-1.5 rounded-full">
                {locale === 'vi' ? 'Chu Trình Dưỡng Nhan Tự Nhiên' : 'Holistic Skincare Ritual'}
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mt-4 mb-3">
                {locale === 'vi'
                  ? 'Phác Đồ Chăm Sóc Da Dịu Nhẹ Tại Nhà'
                  : '4-Step Gentle Skincare Ritual At Home'}
              </h2>
              <p className="text-[#6e5c57] text-base leading-relaxed">
                {locale === 'vi'
                  ? 'Nuôi dưỡng làn da khỏe mạnh, sáng mịn tự nhiên với chu trình 4 bước cân bằng và phục hồi chuyên sâu mỗi ngày.'
                  : 'Follow our specialist-designed 4-step regimen to gently nourish and restore your natural glow.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routineSteps.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-[#fcf9f5] p-6 rounded-[1.75rem] border border-[#efe6dd] relative flex flex-col hover:border-[#d8bfc5] transition-colors"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#f7eef0] border border-[#ead6db] text-[#9e5a6b] font-semibold text-base flex items-center justify-center mb-4">
                    {r.step}
                  </div>
                  <h3 className="text-lg font-semibold text-[#3d312e] mb-2">{r.title}</h3>
                  <p className="text-[#6e5c57] text-sm md:text-base leading-relaxed flex-1">{r.desc}</p>
                  <div className="mt-4 pt-3 border-t border-[#efe6dd] flex items-center gap-1.5 text-xs font-medium text-[#5a6e57]">
                    <CheckCircle2 className="w-4 h-4 text-[#6e806b]" />
                    {locale === 'vi' ? 'Dịu nhẹ cho mọi làn da' : 'Gentle for daily use'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Bottom Soft Botanical Consultation CTA Section */}
        <FadeIn delay={0.3}>
          <div className="mt-16 bg-gradient-to-r from-[#f4ece1] via-[#f7eef0] to-[#eef2ed] rounded-[2.5rem] p-10 md:p-14 text-center text-[#3d312e] border border-[#eadfd3] shadow-[0_16px_44px_-15px_rgba(110,80,75,0.1)] relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#9e5a6b]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#c8a46e]/15 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#9e5a6b] bg-white/80 border border-[#ead6db] px-4 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" />
                {locale === 'vi' ? 'Soi Da & Tư Vấn 1:1 Miễn Phí' : 'Complimentary Skin Analysis'}
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-4">{t('cta.title')}</h2>
              <p className="text-[#6e5c57] text-base md:text-lg mb-8 leading-relaxed">{t('cta.description')}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#9e5a6b] text-white font-medium text-base md:text-lg py-3.5 px-9 rounded-full hover:bg-[#874959] shadow-[0_10px_24px_-6px_rgba(158,90,107,0.45)] hover:-translate-y-0.5 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  {t('cta.button')}
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
