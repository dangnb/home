import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'EduVN — Nền tảng Dạy Học Lập Trình Online',
  description:
    'EduVN là nền tảng học lập trình hàng đầu Việt Nam với hàng trăm bài học chất lượng từ các chuyên gia công nghệ. Học React, Node.js, Python, Flutter và hơn thế nữa.',
  keywords: ['EduVN', 'học lập trình', 'online learning', 'programming courses', 'React', 'Node.js', 'Python'],
  authors: [{ name: 'EduVN Team' }],
  openGraph: {
    title: 'EduVN — Learn Programming Online',
    description: "Vietnam's leading programming learning platform",
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi">
      <body>
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-height)', flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
