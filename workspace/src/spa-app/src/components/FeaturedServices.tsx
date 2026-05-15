'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

const services = [
  { id: 1, img: '/spa_service.png', titleKey: 'facial' },
  { id: 2, img: '/spa_service.png', titleKey: 'massage' },
  { id: 3, img: '/spa_service.png', titleKey: 'laser' },
];

export default function FeaturedServices() {
  const t = useTranslations('HomePage.services');

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">{t('heading')}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={service.img} 
                  alt={t(`items.${service.titleKey}`)} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/services/${service.titleKey}`} className="bg-white text-primary px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {t('viewMore')}
                  </Link>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{t(`items.${service.titleKey}`)}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
