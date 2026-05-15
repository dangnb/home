'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('HomePage.hero');

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img src="/spa_hero_banner.png" alt="Spa Background" className="w-full h-full object-cover brightness-50" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('heading')}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t('subheading')}
        </motion.p>
        
        <motion.button 
          className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 shadow-[0_0_20px_rgba(155,45,119,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('cta')}
        </motion.button>
      </div>
    </section>
  );
}
