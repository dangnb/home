'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Calendar, PlayCircle, ArrowRight } from 'lucide-react';

export default function News() {
  const t = useTranslations('HomePage.news');
  const locale = useLocale();
  const [posts, setPosts] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPosts(data.data.slice(0, 4));
        }
      });
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.videoUrl) {
          setVideoUrl(data.data.videoUrl);
        }
      });
  }, []);

  return (
    <section id="news" className="py-24 bg-[#fcf9f5] border-t border-[#efe6dd]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: News Section */}
          <div className="w-full lg:w-[65%]">
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-2">{t('heading')}</h2>
              <p className="text-base md:text-lg text-[#6e5c57]">{t('subheading')}</p>
              <div className="w-14 h-0.5 bg-[#c8a46e] mt-4 rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post, index) => {
                const dateObj = new Date(post.date);
                const formattedDate = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')
                  : '';
                const content = post[locale] || post['vi'];

                return (
                  <motion.div 
                    key={post.id}
                    className="flex flex-col bg-white rounded-[1.75rem] overflow-hidden border border-[#efe6dd] shadow-[0_10px_30px_-14px_rgba(110,80,75,0.08)] hover:shadow-[0_18px_40px_-12px_rgba(158,90,107,0.14)] transition-all duration-500 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/news/${post.slug}`} className="block relative h-52 overflow-hidden m-2 rounded-[1.35rem]">
                      <img 
                        src={post.image || '/spa_gallery.png'}
                        alt={content?.title || "News"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      {formattedDate && (
                        <span className="absolute top-3 left-3 bg-white/92 backdrop-blur-md text-[#9e5a6b] text-xs font-medium px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                        </span>
                      )}
                    </Link>
                    
                    <div className="p-6 pt-3 flex flex-col flex-1">
                      <Link href={`/news/${post.slug}`}>
                        <h3 className="text-lg md:text-xl font-semibold text-[#3d312e] leading-snug group-hover:text-[#9e5a6b] transition-colors line-clamp-2 mb-2.5">
                          {content?.title}
                        </h3>
                      </Link>
                      
                      <p className="text-base text-[#6e5c57] line-clamp-3 leading-relaxed mb-4 flex-1">
                        {content?.excerpt}
                      </p>

                      <Link
                        href={`/news/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9e5a6b] group-hover:gap-2.5 transition-all"
                      >
                        {t('readMore')} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Video Section */}
          <div className="w-full lg:w-[35%] flex flex-col">
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-[#3d312e] mb-2 flex items-center gap-2.5">
                <PlayCircle className="w-7 h-7 text-[#9e5a6b]" /> {locale === 'vi' ? 'Góc Thư Giãn' : 'Spa Moments'}
              </h2>
              <p className="text-base md:text-lg text-[#6e5c57]">
                {locale === 'vi' ? 'Trải nghiệm không gian & liệu trình tại Ngọc Hương Spa' : 'Discover our space & signature treatments'}
              </p>
              <div className="w-14 h-0.5 bg-[#c8a46e] mt-4 rounded-full"></div>
            </motion.div>

            <motion.div
              className="w-full bg-[#f4ece1]/70 p-5 rounded-[2rem] border border-[#efe6dd] shadow-xs"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-full aspect-video bg-[#3d312e] relative rounded-2xl overflow-hidden shadow-md">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={videoUrl} 
                  title="Spa Therapy Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              </div>
              
              <div className="mt-4">
                <select className="w-full p-3.5 text-sm font-medium rounded-2xl bg-white border border-[#e6dcd2] text-[#4a3b38] outline-none focus:border-[#9e5a6b] transition-colors">
                  <option>Không gian thư giãn Ngọc Hương Spa</option>
                  <option>Cảm nhận khách hàng thực tế</option>
                  <option>Liệu trình chăm sóc da thảo mộc</option>
                </select>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
