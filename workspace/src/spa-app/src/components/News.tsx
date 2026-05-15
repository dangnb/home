'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function News() {
  const t = useTranslations('HomePage.news');

  const posts = ['post1', 'post2', 'post3'];

  return (
    <section id="news" className="py-24 bg-gray-50">
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
          {posts.map((post, index) => (
            <motion.div 
              key={post}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/news/${post}`} className="block relative h-56 overflow-hidden cursor-pointer">
                <img 
                  src="/spa_news.png" 
                  alt="Blog Post" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                  {t(`items.${post}.date`)}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <Link href={`/news/${post}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                    {t(`items.${post}.title`)}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {t(`items.${post}.excerpt`)}
                </p>
                <div className="mt-auto">
                  <Link href={`/news/${post}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                    {t('readMore')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
