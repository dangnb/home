'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const images = [
  '/spa_gallery.png',
  '/spa_hero_banner.png',
  '/spa_service.png',
  '/spa_gallery.png',
  '/spa_service.png',
  '/spa_hero_banner.png'
];

export default function Gallery() {
  const t = useTranslations('HomePage.gallery');

  return (
    <section id="gallery" className="py-24 bg-gray-50">
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, index) => (
            <motion.div 
              key={index}
              className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={src} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
