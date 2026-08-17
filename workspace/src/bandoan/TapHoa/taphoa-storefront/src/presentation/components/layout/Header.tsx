'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/presentation/store/useCartStore';
import { useRouter } from 'next/navigation';
import { ProductImage } from '@/presentation/components/ui/ProductImage';
import {
  ShoppingCart, Search, User, Phone, ChevronDown, ChevronRight, Menu, X,
  Home, Heart, Baby, Sparkles, ChefHat, Coffee, SprayCan, BookOpen, Zap, MapPin, Headphones
} from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_SUBCATEGORIES } from '@/infrastructure/repositories/MockProductRepository';
import { getProductRepository } from '@/infrastructure/di/container';
import { Product } from '@/domain/entities/Product';
import { Sanitizer } from '@/infrastructure/security/sanitizer';

const productRepo = getProductRepository();

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-[18px] h-[18px]" />,
  Heart: <Heart className="w-[18px] h-[18px]" />,
  Baby: <Baby className="w-[18px] h-[18px]" />,
  Sparkles: <Sparkles className="w-[18px] h-[18px]" />,
  ChefHat: <ChefHat className="w-[18px] h-[18px]" />,
  Coffee: <Coffee className="w-[18px] h-[18px]" />,
  SprayCan: <SprayCan className="w-[18px] h-[18px]" />,
  BookOpen: <BookOpen className="w-[18px] h-[18px]" />,
  Zap: <Zap className="w-[18px] h-[18px]" />,
};

export function Header() {
  const router = useRouter();
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowDropdown(false); return; }
    const timer = setTimeout(async () => {
      const sanitized = Sanitizer.sanitizeQuery(searchQuery);
      const result = await productRepo.getProducts({ searchQuery: sanitized, pageSize: 5 });
      setSearchResults(result.items);
      setShowDropdown(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const subcats = hoveredCat ? MOCK_SUBCATEGORIES.filter(s => s.parentId === hoveredCat) : [];

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#006633] via-[#00904a] to-[#006633] text-white text-[11px]">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-8">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/80">
              <MapPin className="w-3 h-3" />
              Với hơn 4816 cửa hàng tại TP.HCM
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <a href="tel:19008888" className="flex items-center gap-1 hover:text-yellow-200 transition-colors font-medium">
              <Headphones className="w-3 h-3" />
              <span>Hotline: <b>1900 8888</b></span>
            </a>
            <span className="text-white/30">|</span>
            <Link href="/tracking" className="hidden md:inline hover:text-yellow-200 transition-colors">Tra cứu đơn hàng</Link>
            <span className="hidden md:inline text-white/30">|</span>
            <Link href="/login" className="hidden md:inline hover:text-yellow-200 transition-colors">Đăng nhập</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[60px] flex items-center gap-4">
          {/* Mobile menu */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2 text-gray-600 hover:text-[#00904a] transition-colors">
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00904a] to-[#006633] rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:shadow-md transition-shadow">
              W
            </div>
            <div className="hidden sm:block">
              <div className="text-[17px] font-black text-gray-900 leading-none tracking-tight">
                Web<span className="text-gradient-green">taphoa</span>.vn
              </div>
              <div className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                Chuỗi Tạp Hóa Việt
              </div>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Tìm kiếm sản phẩm, danh mục..."
                className="w-full pl-4 pr-12 py-2.5 border-2 border-[#00904a] rounded-xl text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00904a]/20 focus:border-[#00904a] transition-all"
              />
              <button
                type="submit"
                onClick={handleSearchSubmit}
                aria-label="Tìm kiếm"
                className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-r from-[#00904a] to-[#007a3e] text-white rounded-r-xl hover:from-[#007a3e] hover:to-[#006633] transition-all flex items-center justify-center cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-scale-in">
                <div className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-1 tracking-wider">Gợi ý sản phẩm</div>
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <ProductImage src={p.image} alt={p.name} width={40} height={40} className="w-10 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                      <div className="text-xs price-tag">{p.price.toLocaleString('vi-VN')}₫</div>
                    </div>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full text-center py-2 text-xs font-bold text-[#00904a] hover:bg-green-50 rounded-lg transition-colors border-t border-gray-100 mt-1"
                >
                  Xem tất cả kết quả cho &ldquo;{searchQuery}&rdquo; →
                </button>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-gray-600 hover:text-[#00904a] transition-colors rounded-lg hover:bg-green-50">
              <User className="w-4 h-4" />
              <span>Tài khoản</span>
            </Link>

            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#00904a] to-[#007a3e] text-white rounded-xl text-[11px] font-bold hover:from-[#007a3e] hover:to-[#006633] transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e60000] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-count-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-4 flex items-stretch">
          {/* Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => { setShowMegaMenu(false); setHoveredCat(null); }}
          >
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00904a] to-[#007a3e] text-white font-bold text-[13px] rounded-t-lg hover:from-[#007a3e] hover:to-[#006633] transition-all h-full">
              <Menu className="w-4 h-4" />
              <span>Danh Mục Sản Phẩm</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMegaMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMegaMenu && (
              <div className="absolute top-full left-0 w-[720px] bg-white shadow-2xl border border-gray-100 rounded-b-xl z-50 flex animate-scale-in overflow-hidden">
                {/* Categories */}
                <div className="w-[250px] border-r border-gray-100 py-1 bg-gray-50/50">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/collections/${cat.slug}`}
                      onMouseEnter={() => setHoveredCat(cat.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-all ${
                        hoveredCat === cat.id
                          ? 'bg-white text-[#00904a] font-bold shadow-sm border-r-2 border-[#00904a]'
                          : 'text-gray-700 hover:bg-white hover:text-[#00904a]'
                      }`}
                    >
                      <span className={hoveredCat === cat.id ? 'text-[#00904a]' : 'text-gray-400'}>{iconMap[cat.iconName]}</span>
                      <span className="flex-1">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </Link>
                  ))}
                </div>

                {/* Subcategories */}
                <div className="flex-1 p-5 bg-white">
                  {hoveredCat ? (
                    <div className="animate-fade-in">
                      <h3 className="text-sm font-bold text-gradient-green mb-3 pb-2 border-b border-green-100">
                        {MOCK_CATEGORIES.find(c => c.id === hoveredCat)?.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                        {subcats.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/collections/${sub.slug}`}
                            className="text-[13px] text-gray-600 hover:text-[#00904a] py-1.5 transition-colors flex items-center gap-1.5 group/sub"
                          >
                            <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/sub:bg-[#00904a] transition-colors" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                      <div className="text-center space-y-2">
                        <div className="text-3xl">📋</div>
                        <p>Di chuột vào danh mục để xem chi tiết</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex items-center ml-1 text-[13px] font-semibold text-gray-700">
            {[
              { href: '/', label: 'Trang Chủ' },
              { href: '/collections/goc-thuc-pham', label: 'Thực Phẩm' },
              { href: '/collections/goc-nau-an', label: 'Nấu Ăn' },
              { href: '/collections/goc-sach-dep', label: 'Sạch Đẹp' },
              { href: '/pages/gioi-thieu', label: 'Giới Thiệu' },
              { href: '/pages/lien-he', label: 'Liên Hệ' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2.5 hover:text-[#00904a] transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#00904a] rounded-full group-hover:w-4/5 transition-all duration-300" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="w-80 max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-gradient-to-r from-[#00904a] to-[#006633] text-white font-bold text-sm flex items-center justify-between">
              <span>DANH MỤC SẢN PHẨM</span>
              <button onClick={() => setShowMobileMenu(false)} className="hover:bg-white/20 p-1 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="py-1">
              {MOCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.slug}`}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 hover:bg-green-50 hover:text-[#00904a] border-b border-gray-50 transition-colors"
                >
                  <span className="text-gray-400">{iconMap[cat.iconName]}</span>
                  <span className="font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 py-1">
              {[
                { href: '/pages/gioi-thieu', label: 'Giới Thiệu' },
                { href: '/pages/lien-he', label: 'Liên Hệ' },
                { href: '/tracking', label: 'Tra Cứu Đơn Hàng' },
                { href: '/login', label: 'Đăng Nhập' },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setShowMobileMenu(false)} className="block px-4 py-3 text-[13px] text-gray-600 hover:bg-green-50 hover:text-[#00904a]">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
