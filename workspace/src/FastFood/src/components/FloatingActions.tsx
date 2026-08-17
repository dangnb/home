'use client';

import React, { useState } from 'react';
import { User, MessageCircle, X, Send, ShieldCheck } from 'lucide-react';

export default function FloatingActions() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Bạn cần TriKun FastFood tư vấn món ngon nào hôm nay?' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Cảm ơn bạn! Đội ngũ tư vấn TriKun đã nhận thông tin "${userText}" và sẽ hỗ trợ bạn ngay lập tức!`,
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fab-container">
        <button
          onClick={() => {
            setShowLoginModal(true);
            setShowChatBox(false);
          }}
          className="fab-btn fab-login"
          title="Tài khoản / Đăng nhập"
        >
          <User className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setShowChatBox(!showChatBox);
            setShowLoginModal(false);
          }}
          className="fab-btn fab-chat relative"
          title="Chat tư vấn trực tiếp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-yellow-400 border-2 border-emerald-600 rounded-full animate-ping" />
        </button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div
            className="modal-content p-6 max-w-sm relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">
              Đăng nhập TriKun
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Đăng nhập để nhận ưu đãi tích điểm 10% cho mọi đơn hàng FastFood!
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Đăng nhập thành công!');
                setShowLoginModal(false);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Số điện thoại hoặc Email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-sky-500"
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-sky-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3 rounded-xl shadow-md transition text-sm"
              >
                Đăng nhập ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Chat Box */}
      {showChatBox && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-emerald-100 z-50 overflow-hidden flex flex-col h-[400px]">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                TK
              </div>
              <div>
                <h4 className="font-extrabold text-xs">Tư vấn TriKun FastFood</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" /> Trực tuyến 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChatBox(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleSendMessage}
              className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
