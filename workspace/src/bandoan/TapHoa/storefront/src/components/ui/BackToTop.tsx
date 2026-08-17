'use client';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 md:bottom-8 right-4 z-40 w-11 h-11 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200/50 flex items-center justify-center hover:bg-emerald-700 hover:scale-110 active:scale-95 transition-all duration-200 animate-fadeIn"
      aria-label="Lên đầu trang"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
