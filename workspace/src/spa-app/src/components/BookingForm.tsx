'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function BookingForm() {
  const t = useTranslations('HomePage.booking');

  return (
    <section id="contact" className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-5/12 bg-gray-50 p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('heading')}</h2>
            <p className="text-gray-600 mb-8">{t('subheading')}</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Hotline</h4>
                <p className="text-2xl font-bold text-primary">1900 1234</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</h4>
                <p className="text-lg font-medium text-gray-900">info@ngochuongspa.com</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12 p-10">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.name')}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.phone')}</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="090 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.service')}</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white">
                  <option>Chăm Sóc Da Mặt Chuyên Sâu</option>
                  <option>Massage Trị Liệu</option>
                  <option>Trẻ Hóa Da Công Nghệ Laser</option>
                </select>
              </div>
              <motion.button 
                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('form.submit')}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
