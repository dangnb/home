'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';

export default function News() {
  const t = useTranslations('HomePage.news');
  const locale = useLocale();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPosts(data.data.slice(0, 4)); // Only show top 4
        }
      });
  }, []);

  return (
    <section id="news" className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: News Section */}
          <div className="w-full lg:w-[65%]">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#8c2a68] uppercase mb-2 tracking-wide">{t('heading')}</h2>
              <p className="text-sm text-gray-600">{t('subheading')}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {posts.map((post, index) => {
                const dateObj = new Date(post.date);
                const day = dateObj.getDate();
                const month = dateObj.getMonth() + 1;
                
                // Use locale (vi/en) to get the right content
                const content = post[locale] || post['vi'];

                return (
                  <motion.div 
                    key={post.id}
                    className="flex flex-col group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/news/${post.slug}`} className="block relative h-40 overflow-hidden mb-4 cursor-pointer border border-gray-100">
                      <img 
                        src={post.image || '/spa_gallery.png'}
                        alt={content?.title || "News"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </Link>
                    
                    <div className="flex gap-3 mb-3">
                      <div className="flex-shrink-0 bg-black text-white w-14 h-16 flex flex-col items-center justify-center font-bold text-center">
                        <span className="text-xl leading-none">{day}</span>
                        <span className="text-[10px] uppercase leading-none mt-1">{locale === 'vi' ? 'Tháng' : 'Month'}<br/>{month}</span>
                      </div>
                      
                      <div className="flex-1">
                        <Link href={`/news/${post.slug}`}>
                          <h3 className="text-xs font-bold text-gray-800 uppercase leading-snug group-hover:text-[#8c2a68] transition-colors line-clamp-3">
                            {content?.title}
                          </h3>
                        </Link>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 line-clamp-4 leading-relaxed">
                      {content?.excerpt}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Video Section */}
          <div className="w-full lg:w-[35%] flex flex-col">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#8c2a68] uppercase mb-2 tracking-wide">VIDEO</h2>
              {/* Optional subheading spacing to align with left side */}
              <p className="text-sm text-transparent select-none hidden md:block">Spacing</p>
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-full aspect-video bg-black relative border-4 border-gray-100 shadow-md">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Spa Therapy Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              </div>
              
              <div className="mt-4">
                <select className="w-full p-2.5 text-sm border border-gray-300 text-gray-700 outline-none focus:border-[#8c2a68] transition-colors">
                  <option>GIỚI THIỆU NGỌC HƯƠNG SPA</option>
                  <option>TRẢI NGHIỆM KHÁCH HÀNG</option>
                  <option>QUY TRÌNH CHĂM SÓC DA</option>
                </select>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
