'use client';

import { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Code2, HelpCircle } from 'lucide-react';
import styles from './AiAssistant.module.css';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý Ảo EduVN AI 🤖. Bạn cần hỗ trợ về kiến thức lập trình hay gợi ý khóa học nào?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Giải thích React useEffect?',
    'Lộ trình học Frontend 2026?',
    'Tối ưu câu lệnh SQL?',
    'Nên học Python hay JS?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInputText('');

    // Simulated AI response generation
    setTimeout(() => {
      let aiReply = '';
      const q = query.toLowerCase();

      if (q.includes('useeffect') || q.includes('effect')) {
        aiReply =
          '💡 `useEffect` là Hook trong React giúp xử lý Side-effects (gọi API, lắng nghe sự kiện, timer). Cú pháp: `useEffect(() => { ... }, [dependencies])`. Nếu mảng dependency rỗng `[]`, effect chỉ chạy 1 lần khi component mounted!';
      } else if (q.includes('lộ trình') || q.includes('frontend')) {
        aiReply =
          '🚀 Lộ trình Frontend 2026 khuyến nghị:\n1. Nền tảng: HTML5, CSS3, JavaScript ES6+\n2. Framework: ReactJS + Next.js 16 (App Router)\n3. Styling: CSS Modules / TailwindCSS\n4. State: Zustand / Redux Toolkit\n👉 Bạn có thể học ngay tại khóa "React.js Từ Zero Đến Hero"!';
      } else if (q.includes('sql') || q.includes('database')) {
        aiReply =
          '⚡ Mẹo tối ưu SQL:\n1. Đánh chỉ mục (INDEX) trên các cột thường xuyên WHERE / JOIN.\n2. Tránh dùng `SELECT *`, chỉ lấy các cột cần thiết.\n3. Dùng EXPLAIN ANALYZE để đọc truy vấn.';
      } else if (q.includes('python') || q.includes('js') || q.includes('ngôn ngữ')) {
        aiReply =
          '🐍 **Python**: Thích hợp làm AI, Data Science, Backend (Django/FastAPI).\n🌐 **JavaScript**: Làm Web (Frontend/Backend), App Mobile (React Native).\n👉 Nếu bạn mới bắt đầu học Web, hãy chọn JavaScript!';
      } else {
        aiReply = `🤖 EduVN AI đã ghi nhận thắc mắc: "${query}".\n\nHệ thống gợi ý bạn có thể tham khảo thêm tại khóa học tương ứng hoặc góc thảo luận tại trang Bản tin (/feeds)!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 400);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        className={styles.floatingBtn}
        onClick={() => setOpen(!open)}
        title="Hỏi Trợ Lý Ảo EduVN AI"
      >
        <Bot size={28} />
        <span className={styles.badgePulse} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <Sparkles size={18} style={{ color: '#c084fc' }} />
              Trợ Lý Ảo EduVN AI
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages List */}
          <div className={styles.messagesList}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.msgBubble} ${
                  msg.sender === 'user' ? styles.userMsg : styles.aiMsg
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className={styles.promptsRow}>
            {quickPrompts.map((p, idx) => (
              <button key={idx} className={styles.promptPill} onClick={() => handleSend(p)}>
                {p}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Đặt câu hỏi cho AI..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
