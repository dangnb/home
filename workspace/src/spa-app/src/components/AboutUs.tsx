'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const t = useTranslations('HomePage.about');

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl transform rotate-3"></div>
              <img src="/spa_about.png" alt="About Spa" className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]" />
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">{t('heading')}</h2>
            <div className="w-20 h-1 bg-primary mb-8 rounded-full"></div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {t('description1')}
            </p>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {t('description2')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{t('mission')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('missionText')}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{t('vision')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('visionText')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
