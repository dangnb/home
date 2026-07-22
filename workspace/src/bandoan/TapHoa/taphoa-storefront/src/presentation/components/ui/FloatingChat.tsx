'use client';
import { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

export function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      {open && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-72 overflow-hidden animate-in slide-in-from-bottom duration-200">
          <div className="bg-[#00904a] text-white p-4">
            <h3 className="font-bold text-sm">Hỗ trợ khách hàng</h3>
            <p className="text-xs text-white/70 mt-0.5">Chúng tôi sẵn sàng hỗ trợ bạn</p>
          </div>
          <div className="p-4 space-y-2">
            <a
              href="tel:19008888"
              className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-[#00904a] text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">Gọi Hotline</div>
                <div className="text-[11px] text-gray-500">1900 8888</div>
              </div>
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-[#0088cc] text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                Z
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">Chat Zalo</div>
                <div className="text-[11px] text-gray-500">Phản hồi nhanh nhất</div>
              </div>
            </a>
            <a
              href="https://m.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-[#1877f2] text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                f
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">Facebook Messenger</div>
                <div className="text-[11px] text-gray-500">Nhắn tin trên Facebook</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 ${
          open
            ? 'bg-gray-800 text-white'
            : 'bg-[#00904a] text-white animate-bounce'
        }`}
        style={{ animationDuration: '2s' }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
