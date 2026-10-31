'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedServices() {
  const t = useTranslations('HomePage.services');
  const locale = useLocale();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const featured = data.data.filter((s: any) => s.featured);
          setServices(featured.length > 0 ? featured : data.data.slice(0, 3));
        }
      });
  }, []);

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-[#fcf9f5] via-[#f7f0e6]/60 to-[#fcf9f5]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#9e5a6b] bg-[#f7eef0] border border-[#ead6db] px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" />
            {locale === 'vi' ? 'Liệu Trình Thư Giãn & Trị Liệu' : 'Signature Holistic Treatments'}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-4">{t('heading')}</h2>
          <div className="w-16 h-0.5 bg-[#c8a46e] mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const content = service[locale] || service['vi'] || {};
            const title = content.title || '';
            const excerpt = content.excerpt || '';

            return (
              <motion.div 
                key={service.id || index}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_12px_36px_-14px_rgba(110,80,75,0.1)] hover:shadow-[0_20px_48px_-12px_rgba(158,90,107,0.16)] transition-all duration-500 border border-[#efe6dd] flex flex-col group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/services/${service.slug}`} className="relative h-64 overflow-hidden block m-2.5 rounded-[1.5rem]">
                  <img 
                    src={service.image || '/spa_service.png'} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3a2a29]/45 via-transparent to-transparent" />
                  {service.price && (
                    <span className="absolute top-3.5 right-3.5 bg-white/92 backdrop-blur-md text-[#9e5a6b] font-semibold text-sm px-4 py-1.5 rounded-full shadow-xs border border-[#efe6dd]">
                      {service.price}
                    </span>
                  )}
                  {service.duration && (
                    <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 text-white text-xs font-medium bg-[#3a2a29]/55 backdrop-blur-md px-3.5 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#ebd3a7]" /> {service.duration}
                    </span>
                  )}
                </Link>

                <div className="p-6 pt-4 flex flex-col flex-1">
                  <Link href={`/services/${service.slug}`}>
                    <h3 className="text-xl font-semibold text-[#3d312e] mb-2.5 group-hover:text-[#9e5a6b] transition-colors line-clamp-1">
                      {title}
                    </h3>
                  </Link>
                  <p className="text-[#6e5c57] text-base leading-relaxed mb-6 line-clamp-2 flex-1">
                    {excerpt}
                  </p>
                  <div className="pt-4 border-t border-[#f3ece4] flex items-center justify-between">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#9e5a6b] group-hover:gap-3 transition-all"
                    >
                      {t('viewMore')} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="#contact"
                      className="text-sm font-medium bg-[#f7eef0] text-[#9e5a6b] px-4 py-2 rounded-full hover:bg-[#9e5a6b] hover:text-white transition-colors"
                    >
                      {locale === 'vi' ? 'Đặt lịch' : 'Book'}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
