'use client';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
