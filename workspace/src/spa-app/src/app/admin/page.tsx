'use client';

import { useEffect, useState } from 'react';
import { FileText, Package, Briefcase, Settings, Sparkles, GraduationCap, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    services: 0,
    training: 0,
    posts: 0,
    products: 0,
    careers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, servicesRes, trainingRes, postsRes, productsRes, careersRes] = await Promise.all([
          fetch('/api/bookings').then(res => res.json()),
          fetch('/api/services').then(res => res.json()),
          fetch('/api/training').then(res => res.json()),
          fetch('/api/posts').then(res => res.json()),
          fetch('/api/products').then(res => res.json()),
          fetch('/api/careers').then(res => res.json())
        ]);
        setStats({
          bookings: bookingsRes?.data?.length || 0,
          services: servicesRes?.data?.length || 0,
          training: trainingRes?.data?.length || 0,
          posts: postsRes?.data?.length || 0,
          products: productsRes?.data?.length || 0,
          careers: careersRes?.data?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Lịch hẹn Khách hàng', value: stats.bookings, icon: CalendarCheck, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/bookings' },
    { title: 'Tổng số Dịch vụ', value: stats.services, icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50', link: '/admin/services' },
    { title: 'Khóa học Đào tạo', value: stats.training, icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/training' },
    { title: 'Tổng số Bài viết', value: stats.posts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/posts' },
    { title: 'Tổng số Sản phẩm', value: stats.products, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/products' },
    { title: 'Vị trí Tuyển dụng', value: stats.careers, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/careers' },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-[#5a123e] via-[#8e2465] to-[#b64b91] rounded-3xl p-8 text-white mb-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#f3d27a]">Bảng điều khiển CMS</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Chào mừng trở lại, Quản trị viên!</h1>
          <p className="text-white/80 text-sm mt-1">Mọi chỉnh sửa tại đây sẽ được cập nhật trực tiếp lên trang chủ Ngọc Hương Spa &amp; Clinic.</p>
        </div>
        <Link href="/admin/bookings" className="bg-white text-primary font-bold px-5 py-2.5 rounded-full text-sm shadow-md hover:scale-105 transition-transform">
          Xem lịch hẹn ({stats.bookings})
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} href={card.link} className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-15 h-15 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.bg}`}>
                <Icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/services/new" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            + Thêm dịch vụ mới
          </Link>
          <Link href="/admin/training/new" className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
            + Thêm khóa đào tạo
          </Link>
          <Link href="/admin/products/new" className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
            + Thêm sản phẩm
          </Link>
          <Link href="/admin/posts/new" className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">
            + Thêm bài viết mới
          </Link>
          <Link href="/admin/settings" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Cấu hình hệ thống
          </Link>
        </div>
      </div>
    </div>
  );
}
