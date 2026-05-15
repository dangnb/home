'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('HomePage.testimonials');

  const clients = ['client1', 'client2', 'client3'];

  return (
    <section className="py-24 bg-white">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {clients.map((client, index) => (
            <motion.div 
              key={client}
              className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 relative mt-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src="/spa_avatar.png" alt="Client Avatar" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex justify-center gap-1 mb-4 mt-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 text-center italic mb-6 leading-relaxed">
                "{t(`items.${client}.content`)}"
              </p>
              
              <h4 className="text-center font-bold text-gray-900">{t(`items.${client}.name`)}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
