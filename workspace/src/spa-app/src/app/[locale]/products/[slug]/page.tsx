import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  PhoneCall,
  ShoppingBag
} from 'lucide-react';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;

  setRequestLocale(locale);

  const products = (await readDb('products')) || [];
  const product = products.find((p: any) => p.slug === slug || p.id === slug);

  if (!product) {
    notFound();
  }

  const tNav = await getTranslations('Navigation');

  const content = product[locale] || product['vi'] || {};
  const title = content.title || '';
  const excerpt = content.excerpt || '';
  const htmlContent = content.content || `<p>${excerpt}</p>`;
  const price = product.price || '';
  const badge = product.badge || 'Chính Hãng';
  const volume = product.volume || '50ml';

  const related = products.filter((p: any) => p.slug !== product.slug).slice(0, 4);

  return (
    <main className="flex-1 w-full bg-[#fcf9f5] py-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#7a6863] mb-10">
          <Link href="/" className="hover:text-[#9e5a6b] transition-colors">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-[#9e5a6b] transition-colors">{tNav('products')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#9e5a6b] font-semibold truncate max-w-xs md:max-w-md">{title}</span>
        </nav>

        {/* Product Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_14px_40px_-15px_rgba(110,80,75,0.08)] border border-[#efe6dd] p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#f7f0e6] border border-[#efe6dd]">
              <img
                src={product.image || '/spa_service.png'}
                alt={title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-white/92 backdrop-blur-md text-[#9e5a6b] border border-[#ead6db] text-xs font-medium px-4 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" /> {badge}
              </span>
            </div>
          </div>

          {/* Right Info */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c8a46e] text-[#c8a46e]" />
                  ))}
                  <span className="text-sm font-medium text-[#6e5c57] ml-1">(5.0)</span>
                </div>
                <span className="text-xs font-medium bg-[#eef2ed] text-[#5a6e57] px-3 py-1 rounded-full">
                  {locale === 'vi' ? 'Sẵn có • Chiết xuất thảo mộc' : 'In Stock • Botanical Grade'}
                </span>
                <span className="text-xs font-medium bg-[#f4ece1] text-[#6e5c57] px-3 py-1 rounded-full">
                  {locale === 'vi' ? `Dung tích: ${volume}` : `Volume: ${volume}`}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-semibold text-[#3d312e] mb-4 leading-tight">
                {title}
              </h1>

              <div className="text-3xl font-semibold text-[#9e5a6b] mb-6 pb-6 border-b border-[#f3ece4]">
                {price}
              </div>

              <p className="text-[#6e5c57] text-base md:text-lg leading-relaxed mb-6">
                {excerpt}
              </p>

              <div className="bg-[#fcf9f5] rounded-3xl p-5 border border-[#efe6dd] space-y-2.5 mb-8">
                <div className="flex items-center gap-2.5 text-sm md:text-base text-[#4a3b38]">
                  <CheckCircle2 className="w-5 h-5 text-[#6e806b] flex-shrink-0" />
                  {locale === 'vi'
                    ? 'Cam kết chính hãng 100% từ Ngọc Hương Natural Spa'
                    : '100% Authentic Product Guaranteed by Ngoc Huong Spa'}
                </div>
                <div className="flex items-center gap-2.5 text-sm md:text-base text-[#4a3b38]">
                  <CheckCircle2 className="w-5 h-5 text-[#6e806b] flex-shrink-0" />
                  {locale === 'vi'
                    ? 'Chiết xuất thảo mộc thiên nhiên lành tính, dịu nhẹ cho da nhạy cảm'
                    : 'Natural herbal extracts, gentle and safe for sensitive skin'}
                </div>
                <div className="flex items-center gap-2.5 text-sm md:text-base text-[#4a3b38]">
                  <CheckCircle2 className="w-5 h-5 text-[#6e806b] flex-shrink-0" />
                  {locale === 'vi'
                    ? 'Chuyên gia đồng hành tư vấn phác đồ chăm sóc da tại nhà 1:1'
                    : 'Includes 1:1 skincare consultation with our specialists'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#f3ece4]">
              <Link
                href="/#contact"
                className="flex-1 min-w-[220px] inline-flex items-center justify-center gap-2 bg-[#9e5a6b] hover:bg-[#874959] text-white font-medium text-base md:text-lg py-4 px-8 rounded-full shadow-[0_10px_24px_-6px_rgba(158,90,107,0.45)] transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                {locale === 'vi' ? 'Đặt mua & Nhận tư vấn ngay' : 'Order & Get Consultation'}
              </Link>
              <a
                href="tel:0902960757"
                className="inline-flex items-center justify-center gap-2 bg-[#fcf9f5] border border-[#d8bfc5] text-[#9e5a6b] font-medium text-base py-4 px-7 rounded-full hover:bg-[#f7eef0] transition-colors"
              >
                <PhoneCall className="w-5 h-5" />
                090 296 0757
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_12px_36px_-15px_rgba(110,80,75,0.06)] border border-[#efe6dd] p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-semibold text-[#3d312e] mb-6 pb-4 border-b border-[#f3ece4] flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#9e5a6b]" />
            {locale === 'vi' ? 'Thành Phần Tự Nhiên & Hướng Dẫn Sử Dụng' : 'Natural Ingredients & Usage Guide'}
          </h2>
          <div
            className="prose prose-lg max-w-none text-[#5c4a46] leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#3d312e]">
              {locale === 'vi' ? 'Sản Phẩm Kết Hợp Dịu Nhẹ' : 'Recommended Companion Products'}
            </h2>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[#9e5a6b] font-medium hover:underline">
              <ArrowLeft className="w-4 h-4" />
              {locale === 'vi' ? 'Xem tất cả' : 'View all'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rel: any, i: number) => {
              const relContent = rel[locale] || rel['vi'] || {};
              return (
                <Link
                  key={rel.id || i}
                  href={`/products/${rel.slug}`}
                  className="bg-white rounded-[1.75rem] overflow-hidden border border-[#efe6dd] shadow-[0_10px_28px_-14px_rgba(110,80,75,0.08)] hover:shadow-[0_18px_38px_-12px_rgba(158,90,107,0.14)] transition-all group flex flex-col"
                >
                  <div className="h-48 overflow-hidden m-2 rounded-[1.25rem] bg-[#f7f0e6]">
                    <img
                      src={rel.image || '/spa_service.png'}
                      alt={relContent.title || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 pt-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-[#3d312e] group-hover:text-[#9e5a6b] transition-colors line-clamp-2 mb-2">
                      {relContent.title}
                    </h3>
                    <span className="mt-auto font-semibold text-[#9e5a6b] text-lg">{rel.price}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
