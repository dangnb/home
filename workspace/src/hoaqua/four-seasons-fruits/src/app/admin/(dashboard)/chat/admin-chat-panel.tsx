"use client";

// Admin Chat Panel - Conversation list + message view

import { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage, markAsRead, closeConversation, reopenConversation } from "@/actions/chat-actions";
import { Send, MessageCircle, User, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  lastMessage: string | null;
  lastAt: Date | null;
  unreadAdmin: number;
  createdAt: Date;
  _count: { messages: number };
}

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: Date;
}

export function AdminChatPanel({ conversations }: { conversations: Conversation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const selectedConv = conversations.find((c) => c.id === selectedId);

  // Load messages when selecting a conversation
  useEffect(() => {
    if (selectedId) {
      const load = async () => {
        const msgs = await getMessages(selectedId);
        setMessages(msgs);
        await markAsRead(selectedId);
      };
      load();

      // Poll for new messages
      pollRef.current = setInterval(async () => {
        const msgs = await getMessages(selectedId);
        setMessages(msgs);
      }, 3000);

      return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }
  }, [selectedId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedId) return;
    setIsSending(true);
    const msg = await sendMessage(selectedId, "admin", input.trim());
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setIsSending(false);
  };

  const handleClose = async () => {
    if (!selectedId) return;
    await closeConversation(selectedId);
    toast.success("Đã đóng cuộc hội thoại");
    router.refresh();
  };

  const handleReopen = async () => {
    if (!selectedId) return;
    await reopenConversation(selectedId);
    toast.success("Đã mở lại cuộc hội thoại");
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat với khách hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <div className="bg-white rounded-xl border overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-sm text-gray-700">
              Cuộc hội thoại ({conversations.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageCircle className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                    selectedId === conv.id ? "bg-emerald-50 border-l-4 border-l-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {conv.customerName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage || "Chưa có tin nhắn"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {conv.unreadAdmin > 0 && (
                        <Badge className="bg-red-500 text-white border-0 text-[10px] h-5 w-5 flex items-center justify-center p-0 rounded-full">
                          {conv.unreadAdmin}
                        </Badge>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        conv.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {conv.status === "open" ? "Mở" : "Đóng"}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2 bg-white rounded-xl border overflow-hidden flex flex-col">
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Chọn cuộc hội thoại</p>
                <p className="text-sm mt-1">Chọn từ danh sách bên trái để xem tin nhắn</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between shrink-0">
                <div>
                  <p className="font-semibold text-sm">{selectedConv?.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {selectedConv?.customerEmail || selectedConv?.customerPhone || "Khách vãng lai"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedConv?.status === "open" ? (
                    <Button variant="outline" size="sm" onClick={handleClose} className="text-red-500 hover:text-red-700">
                      <X className="h-3.5 w-3.5 mr-1" /> Đóng
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleReopen} className="text-emerald-600">
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Mở lại
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender === "admin"
                          ? "bg-emerald-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                      <p className={`text-[10px] mt-1 ${msg.sender === "admin" ? "text-emerald-200" : "text-gray-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedConv?.status === "open" && (
                <div className="border-t p-4 shrink-0">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Nhập tin nhắn trả lời..."
                      className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isSending || !input.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedConv?.status === "closed" && (
                <div className="border-t p-4 text-center text-sm text-gray-500 bg-gray-50">
                  Cuộc hội thoại đã đóng. Nhấn &quot;Mở lại&quot; để tiếp tục.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
