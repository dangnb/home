'use client';

import { useTranslations } from 'next-intl';
import FadeIn from './FadeIn';
import { Play } from 'lucide-react';
import { useState } from 'react';

export default function VideoSection() {
  const t = useTranslations('HomePage.video');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{t('heading')}</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{t('description')}</p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl group bg-black aspect-video flex items-center justify-center">
            {!isPlaying ? (
              <>
                {/* Cover Image */}
                <img 
                  src="/spa_service.png" 
                  alt="Spa Therapy Video" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
                />
                
                {/* Play Button Overlay */}
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 w-24 h-24 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-primary hover:scale-110 transition-all duration-300 group-hover:shadow-primary/50"
                  aria-label="Play Video"
                >
                  <Play className="w-10 h-10 ml-2" fill="currentColor" />
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
                </button>
              </>
            ) : (
              /* Actual Video Embed */
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                title="Spa Therapy Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
