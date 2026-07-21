'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const quickReplies = [
  'Giờ giao hàng?',
  'Chính sách đổi trả?',
  'Cách đặt hàng?',
  'Liên hệ hotline',
];

const botResponses: Record<string, string> = {
  'giờ giao hàng': 'Chúng tôi giao hàng từ 6h-22h hàng ngày. Đơn hàng nội thành giao trong 2 giờ, ngoại thành 4-6 giờ. 🚚',
  'chính sách đổi trả': 'Bạn có thể đổi trả trong 24h sau khi nhận hàng. Hoàn tiền 100% nếu sản phẩm không đúng mô tả. Liên hệ hotline 1900 1234 để được hỗ trợ! 🔄',
  'cách đặt hàng': 'Rất đơn giản! Bạn chỉ cần:\n1. Chọn sản phẩm và nhấn (+) thêm vào giỏ\n2. Vào giỏ hàng kiểm tra\n3. Nhấn "Thanh toán" và nhập thông tin giao hàng\n4. Xác nhận đơn hàng!\nChúng tôi hỗ trợ COD và chuyển khoản. 🛒',
  'liên hệ hotline': 'Bạn có thể liên hệ chúng tôi qua:\n📞 Hotline: 1900 1234\n📧 Email: support@taphoa.vn\n⏰ Thời gian hỗ trợ: 8h - 22h hàng ngày',
  'xin chào': 'Xin chào! 👋 Tôi là trợ lý ảo của TạpHóa. Tôi có thể giúp bạn về:\n• Thông tin giao hàng\n• Chính sách đổi trả\n• Hướng dẫn đặt hàng\n• Liên hệ hỗ trợ\nBạn cần hỗ trợ gì ạ?',
  'cảm ơn': 'Không có gì ạ! 😊 Nếu cần hỗ trợ thêm, đừng ngại nhắn tin cho TạpHóa nhé!',
};

function getTimeNow() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function getBotReply(userMsg: string): string {
  const lower = userMsg.toLowerCase().trim();
  for (const [key, val] of Object.entries(botResponses)) {
    if (lower.includes(key)) return val;
  }
  return 'Cảm ơn bạn đã liên hệ! Để được hỗ trợ chi tiết, vui lòng gọi hotline 1900 1234 hoặc gửi email tới support@taphoa.vn. Nhân viên sẽ phản hồi sớm nhất! 😊';
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: 'Xin chào! 👋 Tôi là trợ lý ảo TạpHóa. Bạn cần hỗ trợ gì ạ?', sender: 'bot', time: getTimeNow() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [unread, setUnread] = useState(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text: text.trim(), sender: 'user', time: getTimeNow() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing
    setTimeout(() => {
      const reply: Message = { id: Date.now() + 1, text: getBotReply(text), sender: 'bot', time: getTimeNow() };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
      if (!isOpen) setUnread(prev => prev + 1);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-20 md:bottom-24 right-4 z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="w-[340px] md:w-[380px] bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: 'min(520px, 70vh)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">TạpHóa Support</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-emerald-200 text-[11px]">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-1.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'bot' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {msg.sender === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-md'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-0.5 block ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto hide-scrollbar flex-shrink-0">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="flex-shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors border border-emerald-200"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-gray-50 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 md:bottom-8 right-16 md:right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800 rotate-0'
            : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-110'
        }`}
        aria-label="Chat hỗ trợ"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
