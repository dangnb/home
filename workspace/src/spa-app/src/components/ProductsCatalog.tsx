'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import {
  ShoppingBag,
  Star,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Phone
} from 'lucide-react';

interface ProductsCatalogProps {
  products: any[];
  locale: string;
}

export default function ProductsCatalog({ products, locale }: ProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickOrderProduct, setQuickOrderProduct] = useState<any | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = [
    { id: 'all', labelVi: 'Tất cả sản phẩm', labelEn: 'All Products' },
    { id: 'cleansing', labelVi: 'Làm sạch & Toner', labelEn: 'Cleansing & Toner' },
    { id: 'treatment', labelVi: 'Serum & Đặc trị', labelEn: 'Serums & Treatments' },
    { id: 'moisturizer', labelVi: 'Kem dưỡng & Mặt nạ', labelEn: 'Moisturizers & Masks' },
    { id: 'sunscreen', labelVi: 'Chống nắng bảo vệ', labelEn: 'Sun Protection' },
  ];

  const filteredProducts = products.filter((product) => {
    const content = product[locale] || product['vi'] || {};
    const matchesCat =
      selectedCategory === 'all' ||
      (product.category || 'treatment') === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      (content.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (content.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickOrderProduct) return;
    setSubmitting(true);
    try {
      const content = quickOrderProduct[locale] || quickOrderProduct['vi'] || {};
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          service: `[Đặt mua SP] ${content.title} (${quickOrderProduct.price})`
        })
      });
      if (res.ok) {
        setOrderSuccess(true);
        setCustomerName('');
        setCustomerPhone('');
        setTimeout(() => {
          setOrderSuccess(false);
          setQuickOrderProduct(null);
        }, 2200);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Soft Botanical Filter & Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(110,80,75,0.08)] border border-[#efe6dd] mb-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 cursor-pointer ${
                  active
                    ? 'bg-[#9e5a6b] text-white shadow-[0_6px_18px_-4px_rgba(158,90,107,0.4)]'
                    : 'bg-[#fcf9f5] text-[#5c4a46] border border-[#efe6dd] hover:bg-[#f7eef0] hover:text-[#9e5a6b] hover:border-[#ead6db]'
                }`}
              >
                {locale === 'vi' ? cat.labelVi : cat.labelEn}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#9c8982] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'vi' ? 'Tìm sản phẩm thảo mộc...' : 'Search botanical skincare...'}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#e6dcd2] bg-[#fcf9f5] focus:bg-white focus:border-[#9e5a6b] outline-none text-sm md:text-base text-[#3d312e] transition-colors"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {filteredProducts.map((product: any, idx: number) => {
          const content = product[locale] || product['vi'] || {};
          const name = content.title || '';
          const desc = content.excerpt || '';
          const price = product.price || '';
          const badge = product.badge || 'Thảo Mộc';
          const volume = product.volume || '50ml';
          const rating = product.rating || 5.0;
          const imagePath = product.image || (idx % 2 === 0 ? '/spa_about.png' : '/spa_service.png');

          return (
            <div
              key={product.id || idx}
              className="bg-white rounded-[2rem] overflow-hidden shadow-[0_12px_36px_-15px_rgba(110,80,75,0.08)] hover:shadow-[0_20px_44px_-12px_rgba(158,90,107,0.15)] hover:-translate-y-1 transition-all duration-500 border border-[#efe6dd] flex flex-col h-full group"
            >
              {/* Product Image with Soft Organic Frame */}
              <Link href={`/products/${product.slug}`} className="h-60 overflow-hidden relative block m-2.5 rounded-[1.5rem] bg-[#f7f0e6]">
                <img
                  src={imagePath}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a2a29]/30 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />

                {/* Top Left Soft Pill Badge */}
                <span className="absolute top-3 left-3 bg-white/92 backdrop-blur-md text-[#9e5a6b] border border-[#ead6db] text-xs font-medium px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#c8a46e]" /> {badge}
                </span>

                {/* Bottom Right Volume Tag */}
                <span className="absolute bottom-3 right-3 bg-[#3a2a29]/65 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full">
                  {volume}
                </span>
              </Link>

              {/* Card Body */}
              <div className="p-6 pt-3 flex flex-col flex-1">
                {/* Rating Row */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#c8a46e] text-[#c8a46e]" />
                    ))}
                    <span className="text-xs font-medium text-[#7a6863] ml-1">({rating.toFixed(1)})</span>
                  </div>
                  <span className="text-xs font-medium text-[#5a6e57] bg-[#eef2ed] px-2.5 py-0.5 rounded-full">
                    {locale === 'vi' ? 'Sẵn có' : 'In Stock'}
                  </span>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-lg font-semibold text-[#3d312e] mb-2 group-hover:text-[#9e5a6b] transition-colors line-clamp-2 min-h-[3.1rem]">
                    {name}
                  </h3>
                </Link>

                <p className="text-[#6e5c57] text-sm md:text-[15px] mb-5 flex-1 leading-relaxed line-clamp-3">
                  {desc}
                </p>

                {/* Price & Actions */}
                <div className="pt-4 border-t border-[#f3ece4] mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#9c8982] block">
                        {locale === 'vi' ? 'Giá niêm yết' : 'Price'}
                      </span>
                      <span className="font-semibold text-xl text-[#9e5a6b]">{price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickOrderProduct(product)}
                      className="inline-flex items-center gap-1.5 bg-[#9e5a6b] hover:bg-[#874959] text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-[0_6px_16px_-4px_rgba(158,90,107,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {locale === 'vi' ? 'Đặt mua' : 'Order'}
                    </button>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full py-2 rounded-full bg-[#fcf9f5] border border-[#efe6dd] text-[#6e5c57] hover:bg-[#f7eef0] hover:text-[#9e5a6b] hover:border-[#ead6db] text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {locale === 'vi' ? 'Khám phá thành phần & công dụng' : 'View Ingredients & Details'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[2rem] border border-[#efe6dd]">
          <p className="text-lg text-[#7a6863]">
            {locale === 'vi' ? 'Không tìm thấy sản phẩm phù hợp.' : 'No matching products found.'}
          </p>
        </div>
      )}

      {/* Soft Quick Order Modal */}
      {quickOrderProduct && (
        <div className="fixed inset-0 z-50 bg-[#3a2a29]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcf9f5] rounded-[2.25rem] max-w-md w-full p-7 shadow-2xl border border-[#efe6dd] relative">
            <button
              type="button"
              onClick={() => setQuickOrderProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#8c7a74] hover:bg-[#f4ece1] hover:text-[#3d312e]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 mb-5 border-b border-[#efe6dd]">
              <img
                src={quickOrderProduct.image || '/spa_service.png'}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover border border-[#efe6dd]"
              />
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-[#9e5a6b]">
                  {locale === 'vi' ? 'Đặt mua & Tư vấn nhẹ nhàng' : 'Quick Order'}
                </span>
                <h4 className="font-semibold text-[#3d312e] text-base line-clamp-1">
                  {(quickOrderProduct[locale] || quickOrderProduct.vi)?.title}
                </h4>
                <p className="text-[#9e5a6b] font-semibold text-base">{quickOrderProduct.price}</p>
              </div>
            </div>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-[#6e806b] mx-auto" />
                <h5 className="text-xl font-semibold text-[#3d312e]">
                  {locale === 'vi' ? 'Đặt hàng thành công!' : 'Order Submitted!'}
                </h5>
                <p className="text-sm text-[#6e5c57]">
                  {locale === 'vi'
                    ? 'Chuyên viên Ngọc Hương Spa sẽ liên hệ xác nhận đơn hàng và hướng dẫn chăm sóc da chi tiết cho bạn.'
                    : 'Our specialist will contact you shortly to confirm your order.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3b38] mb-1.5">
                    {locale === 'vi' ? 'Họ và tên của bạn' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Thị Mai"
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dcd2] bg-white outline-none focus:border-[#9e5a6b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a3b38] mb-1.5">
                    {locale === 'vi' ? 'Số điện thoại nhận hàng / Zalo' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="090 123 4567"
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dcd2] bg-white outline-none focus:border-[#9e5a6b]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#9e5a6b] hover:bg-[#874959] text-white font-medium py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  {submitting
                    ? '...'
                    : locale === 'vi'
                    ? 'Xác nhận đặt mua & Nhận tư vấn'
                    : 'Confirm Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
