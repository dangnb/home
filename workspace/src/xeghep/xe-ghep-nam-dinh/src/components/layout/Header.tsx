"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/#bang-gia", label: "Bảng giá" },
  { href: "/#dich-vu", label: "Dịch vụ" },
  { href: "/dat-ve", label: "Đặt vé" },
  { href: "/blog", label: "Blog" },
  { href: "/#lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">XG</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-blue-900 text-lg leading-tight">Xe Ghép</p>
              <p className="text-xs text-gray-500">Nam Định</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://zalo.me/0379803990"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              <MessageCircle size={16} />
              Zalo
            </a>
            <a
              href="tel:0379803990"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm"
            >
              <Phone size={16} />
              0379.803.990
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-3 border-t">
                <a
                  href="https://zalo.me/0379803990"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium"
                >
                  <MessageCircle size={16} />
                  Zalo
                </a>
                <a
                  href="tel:0379803990"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-lg font-medium"
                >
                  <Phone size={16} />
                  Gọi ngay
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
