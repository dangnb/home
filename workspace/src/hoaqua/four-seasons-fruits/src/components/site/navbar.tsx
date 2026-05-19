"use client";

// Navbar - Clean minimal design with underline active state
// Inspired by FreshMarket's clean header

import Link from "next/link";
import { ShoppingCart, Menu, X, Leaf, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/#categories", label: "Danh mục" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/contact", label: "Liên hệ" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = mounted ? getTotalItems() : 0;
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Leaf className="h-7 w-7 text-emerald-600 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold text-gray-900">
            FourSeasons
          </span>
        </Link>

        {/* Desktop Navigation - centered */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "text-emerald-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Admin link */}
          <Link
            href="/admin/login"
            className="hidden md:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="h-5 w-5 text-gray-700" />
          </Link>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden bg-white"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
