'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const images = [
  { src: '/spa_hero_natural.png', titleVi: 'Không gian trị liệu ánh sáng tự nhiên', titleEn: 'Sunlit Natural Therapy Suite' },
  { src: '/spa_gallery.png', titleVi: 'Tinh chất thảo mộc thuần khiết', titleEn: 'Pure Botanical Essences' },
  { src: '/spa_service.png', titleVi: 'Chăm sóc da thư giãn chuyên sâu', titleEn: 'Deeply Relaxing Facial Care' },
  { src: '/spa_about.png', titleVi: 'Sảnh đón tiếp thanh lịch & ấm cúng', titleEn: 'Serene Reception Lounge' },
  { src: '/spa_service.png', titleVi: 'Liệu pháp tinh dầu & đá ấm thảo dược', titleEn: 'Aromatherapy & Herbal Warm Stone' },
  { src: '/spa_hero_natural.png', titleVi: 'Góc nghỉ ngơi thưởng trà dưỡng nhan', titleEn: 'Herbal Tea & Relaxation Corner' },
];

export default function Gallery() {
  const t = useTranslations('HomePage.gallery');
  const locale = useLocale();

  return (
    <section id="gallery" className="py-24 bg-[#fcf9f5]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#9e5a6b] bg-[#f7eef0] border border-[#ead6db] px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" />
            {locale === 'vi' ? 'Không Gian & Trải Nghiệm' : 'Space & Experience'}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-4">{t('heading')}</h2>
          <div className="w-16 h-0.5 bg-[#c8a46e] mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
          {images.map((item, index) => (
            <motion.div 
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-[2rem] cursor-pointer group shadow-[0_10px_30px_-12px_rgba(110,80,75,0.1)] border border-[#efe6dd] transition-all duration-500"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <img src={item.src} alt={item.titleVi} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2a29]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium text-sm md:text-base transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {locale === 'vi' ? item.titleVi : item.titleEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
