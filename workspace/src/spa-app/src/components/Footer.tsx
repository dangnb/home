import { useTranslations } from 'next-intl';


export default function Footer() {
  const t = useTranslations('Navigation');

  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-2xl shadow-md">
              NH
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">Ngọc Hương Spa & Clinic</span>
          </div>
          <p className="text-white/80 max-w-sm leading-relaxed mb-6">
            Awaken Your Natural Beauty. We provide professional beauty and relaxation services tailored just for you.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="/" className="text-white/80 hover:text-white transition-colors">{t('home')}</a></li>
            <li><a href="/#services" className="text-white/80 hover:text-white transition-colors">{t('services')}</a></li>
            <li><a href="/#about" className="text-white/80 hover:text-white transition-colors">{t('about')}</a></li>
            <li><a href="/#contact" className="text-white/80 hover:text-white transition-colors">{t('contact')}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-white/80">
            <li>Hotline: <a href="tel:19001234" className="hover:text-white transition-colors font-semibold">1900 1234</a></li>
            <li>Email: info@ngochuongspa.com</li>
            <li>Address: 123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/20 text-center text-white/60 text-sm">
        &copy; {new Date().getFullYear()} Ngọc Hương Spa & Clinic. All rights reserved.
      </div>
    </footer>
  );
}
