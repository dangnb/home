'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Eye } from 'lucide-react';

export default function AboutUs() {
  const t = useTranslations('HomePage.about');
  const locale = useLocale();

  return (
    <section id="about" className="py-24 bg-[#fcf9f5] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-[#f4ece1] rounded-[2.5rem] transform rotate-2"></div>
              <img src="/spa_about.png" alt="About Spa" className="relative rounded-[2.25rem] shadow-[0_18px_50px_-15px_rgba(110,80,75,0.15)] w-full object-cover h-[480px] border-4 border-white" />
              
              {/* Soft Botanical Floating Badge */}
              <div className="absolute -bottom-6 -right-4 md:right-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-[0_16px_40px_-10px_rgba(110,80,75,0.14)] border border-[#efe6dd] flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#f7eef0] border border-[#ead6db] text-[#9e5a6b] flex items-center justify-center font-semibold text-xl">
                  5★
                </div>
                <div>
                  <p className="font-semibold text-[#3d312e] text-base">
                    {locale === 'vi' ? 'Không Gian Trị Liệu Tinh Tế' : 'Serene Healing Sanctuary'}
                  </p>
                  <p className="text-xs text-[#7a6863]">
                    {locale === 'vi' ? 'Thảo mộc tự nhiên & Chuyên gia tận tâm' : 'Natural botanicals & caring specialists'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#9e5a6b] bg-[#f7eef0] border border-[#ead6db] px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#c8a46e]" />
              Ngọc Hương Natural Spa
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-5 leading-tight">{t('heading')}</h2>
            <div className="w-16 h-0.5 bg-[#c8a46e] mb-7 rounded-full"></div>
            <p className="text-[#6e5c57] text-base md:text-lg mb-5 leading-relaxed">
              {t('description1')}
            </p>
            <p className="text-[#6e5c57] text-base md:text-lg mb-8 leading-relaxed">
              {t('description2')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_-15px_rgba(110,80,75,0.08)] border border-[#efe6dd]">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#9e5a6b] flex items-center justify-center mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-[#3d312e] mb-2">{t('mission')}</h3>
                <p className="text-[#6e5c57] text-sm leading-relaxed">{t('missionText')}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_-15px_rgba(110,80,75,0.08)] border border-[#efe6dd]">
                <div className="w-10 h-10 rounded-2xl bg-[#eef2ed] text-[#6e806b] flex items-center justify-center mb-3">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-[#3d312e] mb-2">{t('vision')}</h3>
                <p className="text-[#6e5c57] text-sm leading-relaxed">{t('visionText')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
