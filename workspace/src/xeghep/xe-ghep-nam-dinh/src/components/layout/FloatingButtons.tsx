"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.a
        href="https://zalo.me/0379803990"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        aria-label="Chat Zalo"
      >
        <MessageCircle size={24} />
      </motion.a>
      <motion.a
        href="tel:0379803990"
        className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(249, 115, 22, 0.4)",
            "0 0 0 10px rgba(249, 115, 22, 0)",
            "0 0 0 0 rgba(249, 115, 22, 0)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-label="Gọi điện"
      >
        <Phone size={24} />
      </motion.a>
    </div>
  );
}
