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
    <div className="flex gap-1 items-center bg-gray-100 rounded-full p-1">
      <button 
        onClick={() => handleLocaleChange('vi')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${locale === 'vi' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        VI
      </button>
      <button 
        onClick={() => handleLocaleChange('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${locale === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        EN
      </button>
    </div>
  );
}
