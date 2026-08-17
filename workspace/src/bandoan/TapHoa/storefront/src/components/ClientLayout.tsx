'use client';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import MobileBottomNav from './ui/MobileBottomNav';
import { ToastProvider } from './ui/ToastProvider';
import BackToTop from './ui/BackToTop';
import CookieConsent from './ui/CookieConsent';
import ChatWidget from './ui/ChatWidget';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <Header onOpenCart={() => setIsCartOpen(true)} />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <MobileBottomNav onOpenCart={() => setIsCartOpen(true)} />
        <BackToTop />
        <CookieConsent />
        <ChatWidget />
      </div>
    </ToastProvider>
  );
}
