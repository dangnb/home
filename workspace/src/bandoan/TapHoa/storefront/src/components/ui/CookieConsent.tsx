'use client';
import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('taphoa-cookies');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('taphoa-cookies', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fadeInUp">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl shadow-black/10 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <Cookie className="w-8 h-8 text-amber-500 flex-shrink-0 hidden md:block" />
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            <strong>Chúng tôi sử dụng cookie</strong> để cải thiện trải nghiệm mua sắm. 
            Bằng cách tiếp tục, bạn đồng ý với{' '}
            <a href="#" className="text-emerald-600 underline">chính sách cookie</a> của chúng tôi.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={accept} className="bg-emerald-600 text-white font-bold text-sm px-5 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
            Đồng ý
          </button>
          <button onClick={accept} className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
