'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('HomePage.testimonials');
  const locale = useLocale();

  const clients = ['client1', 'client2', 'client3'];

  return (
    <section className="py-24 bg-gradient-to-b from-[#f7f0e6]/70 to-[#fcf9f5]">
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
            {locale === 'vi' ? 'Cảm Nhận Khách Hàng' : 'Client Stories'}
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-4">{t('heading')}</h2>
          <div className="w-16 h-0.5 bg-[#c8a46e] mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {clients.map((client, index) => (
            <motion.div 
              key={client}
              className="bg-white p-8 rounded-[2rem] shadow-[0_12px_36px_-14px_rgba(110,80,75,0.08)] border border-[#efe6dd] relative mt-8 hover:shadow-[0_18px_42px_-12px_rgba(158,90,107,0.14)] transition-all duration-500 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -top-9 left-8 w-18 h-18 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-[#ead6db]">
                <img src="/spa_avatar.png" alt="Client Avatar" className="w-full h-full object-cover" />
              </div>

              <Quote className="w-9 h-9 text-[#9e5a6b]/15 ml-auto mb-2" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c8a46e] text-[#c8a46e]" />
                ))}
              </div>
              
              <p className="text-[#6e5c57] italic mb-6 leading-relaxed flex-1">
                &ldquo;{t(`items.${client}.content`)}&rdquo;
              </p>
              
              <div className="pt-4 border-t border-[#f3ece4]">
                <h4 className="font-semibold text-[#3d312e]">{t(`items.${client}.name`)}</h4>
                <span className="text-xs text-[#9e5a6b] font-medium">
                  {locale === 'vi' ? 'Khách hàng thân thiết' : 'Verified Client'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
