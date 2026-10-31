'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-1 items-center bg-[#f4ece1] border border-[#e8ddd0] rounded-full p-1">
      <button 
        onClick={() => handleLocaleChange('vi')}
        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${locale === 'vi' ? 'bg-[#9e5a6b] text-white shadow-xs' : 'text-[#6e5c57] hover:text-[#3d312e]'}`}
      >
        VI
      </button>
      <button 
        onClick={() => handleLocaleChange('en')}
        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${locale === 'en' ? 'bg-[#9e5a6b] text-white shadow-xs' : 'text-[#6e5c57] hover:text-[#3d312e]'}`}
      >
        EN
      </button>
    </div>
  );
}
