import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, ChevronDown } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Navigation');
  const tCat = useTranslations('ServiceCategories');
  
  const categories = [
    'body-care', 'facial-care', 'herbal-hair-wash', 'eye-care',
    'rf-weight-loss', 'traditional-medicine-skin-care', 'acne-treatment',
    'melasma-treatment', 'safe-skin-whitening', 'full-body-massage',
    'permanent-hair-removal', 'cosmetic-tattooing', 'acne-treatment-process', 'waxing'
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
            NH
          </div>
          <span className="font-bold text-2xl text-primary hidden md:block tracking-tight">Ngọc Hương Spa</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-semibold">{t('home')}</Link>
          <div className="relative group">
            <Link href="/#services" className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-semibold py-6">
              {t('services')}
              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-8 z-50 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat} 
                    href={`/category/${cat}`} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-gray-600 hover:text-primary transition-colors group/item"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary/30 group-hover/item:bg-primary transition-colors"></div>
                    <span className="font-medium text-sm leading-snug">{tCat(cat as any)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/#about" className="text-gray-700 hover:text-primary transition-colors font-semibold">{t('about')}</Link>
          <Link href="/#gallery" className="text-gray-700 hover:text-primary transition-colors font-semibold">{t('gallery')}</Link>
          <Link href="/#contact" className="text-gray-700 hover:text-primary transition-colors font-semibold">{t('contact')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 border-r border-gray-200 pr-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
            </a>
          </div>
          <LanguageSwitcher />
          <button className="lg:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
