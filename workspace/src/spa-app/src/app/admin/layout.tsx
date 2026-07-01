'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Package, 
  Briefcase, 
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

  // If on login page, don't show the layout
  if (pathname === '/admin/login') {
    return (
      <html lang="vi">
        <body>
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
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bài viết (News)', href: '/admin/posts', icon: FileText },
    { name: 'Sản phẩm (Products)', href: '/admin/products', icon: Package },
    { name: 'Tuyển dụng (Careers)', href: '/admin/careers', icon: Briefcase },
    { name: 'Cấu hình (Settings)', href: '/admin/settings', icon: Settings },
  ];

  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full flex flex-col">
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                <span className="text-xl font-bold text-primary">Admin Panel</span>
                <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-primary text-white font-semibold' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8 sticky top-0 z-30">
              <button 
                className="lg:hidden mr-4 text-gray-500 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="text-gray-500 font-medium">Ngọc Hương Spa & Clinic CMS</div>
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
