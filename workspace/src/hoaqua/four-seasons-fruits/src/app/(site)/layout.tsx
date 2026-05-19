// Layout for public-facing pages (customer site)
// Includes Navbar, CartDrawer, Footer, and Chat Widget

import { Navbar } from "@/components/site/navbar";
import { CartDrawer } from "@/components/site/cart-drawer";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/site/chat-widget";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
