'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Package, 
  Briefcase, 
  Sparkles,
  GraduationCap,
  CalendarCheck,
  ExternalLink,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import '../globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return (
      <html lang="vi" suppressHydrationWarning>
        <body suppressHydrationWarning className="bg-[#fdf5f9] text-gray-900">
          {children}
        </body>
      </html>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Tổng quan (Dashboard)', href: '/admin', icon: LayoutDashboard },
    { name: 'Lịch hẹn (Bookings)', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Dịch vụ (Services)', href: '/admin/services', icon: Sparkles },
    { name: 'Đào tạo (Training)', href: '/admin/training', icon: GraduationCap },
    { name: 'Bài viết (News)', href: '/admin/posts', icon: FileText },
    { name: 'Sản phẩm (Products)', href: '/admin/products', icon: Package },
    { name: 'Tuyển dụng (Careers)', href: '/admin/careers', icon: Briefcase },
    { name: 'Cấu hình (Settings)', href: '/admin/settings', icon: Settings },
  ];

  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#f8f5f7] text-gray-900">
        <div className="min-h-screen flex">
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Luxury Dark Plum Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 left-0 z-50 w-68 h-screen bg-gradient-to-b from-[#330a24] to-[#1e0515] text-white transition-transform duration-300 ease-in-out shadow-xl
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full flex flex-col">
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8e2465] to-[#b64b91] flex items-center justify-center text-[#f3d27a] font-serif font-bold text-lg ring-2 ring-[#f3d27a]/40">
                    NH
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block leading-none">Ngọc Hương</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#f3d27a]">CMS Admin</span>
                  </div>
                </div>
                <button className="lg:hidden text-white/70" onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#8e2465] to-[#b64b91] text-white font-semibold shadow-md border border-[#f3d27a]/30' 
                          : 'text-white/75 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#f3d27a]' : ''}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/15 hover:text-red-200 rounded-xl transition-colors text-sm font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-xs">
              <div className="flex items-center">
                <button 
                  className="lg:hidden mr-4 text-gray-500 hover:text-gray-900"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-gray-900 font-bold text-base">Hệ Thống Quản Trị Ngọc Hương Spa &amp; Clinic</h2>
                  <p className="text-xs text-gray-500">Quản lý nội dung, dịch vụ, sản phẩm &amp; lịch hẹn trực tuyến</p>
                </div>
              </div>

              <a
                href="/vi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-primary bg-[#fdf5f9] hover:bg-primary hover:text-white px-4 py-2 rounded-full border border-[#f0e6ec] transition-colors"
              >
                Xem trang web <ExternalLink className="w-4 h-4" />
              </a>
            </header>

            <div className="p-4 lg:p-8 overflow-auto flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
