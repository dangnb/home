"use client";

// Floating Chat Widget for customers
// Shows a chat bubble button, opens a chat box

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrCreateConversation, sendMessage, getMessages } from "@/actions/chat-actions";

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "chat">("form");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages when chat is open
  useEffect(() => {
    if (isOpen && conversationId && step === "chat") {
      const poll = async () => {
        const msgs = await getMessages(conversationId);
        setMessages(msgs);
      };
      poll();
      pollRef.current = setInterval(poll, 3000);
      return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }
  }, [isOpen, conversationId, step]);

  const handleStartChat = async () => {
    if (!name.trim()) return;
    const conv = await getOrCreateConversation({
      customerName: name,
      customerEmail: email || undefined,
    });
    setConversationId(conv.id);
    setStep("chat");

    // Load existing messages
    const msgs = await getMessages(conv.id);
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;
    setIsSending(true);

    const msg = await sendMessage(conversationId, "customer", input.trim());
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setIsSending(false);
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Pulse indicator */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-sm">Four Seasons Support</h3>
                <p className="text-emerald-100 text-xs">Thường trả lời trong vài phút</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); setStep("form"); setConversationId(null); setMessages([]); }}
                  className="p-1.5 rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {step === "form" ? (
              /* Start Form */
              <div className="flex-1 p-5 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Xin chào! 👋</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Chúng tôi sẵn sàng hỗ trợ bạn
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên của bạn *"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => { if (e.key === "Enter") handleStartChat(); }}
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (tùy chọn)"
                    type="email"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => { if (e.key === "Enter") handleStartChat(); }}
                  />
                  <button
                    onClick={handleStartChat}
                    disabled={!name.trim()}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Bắt đầu chat
                  </button>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      <p>Hãy gửi tin nhắn đầu tiên!</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                          msg.sender === "customer"
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-3 shrink-0">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isSending || !input.trim()}
                      className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
