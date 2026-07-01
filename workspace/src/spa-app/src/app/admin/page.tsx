'use client';

import { useEffect, useState } from 'react';
import { FileText, Package, Briefcase, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    products: 0,
    careers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, productsRes, careersRes] = await Promise.all([
          fetch('/api/posts').then(res => res.json()),
          fetch('/api/products').then(res => res.json()),
          fetch('/api/careers').then(res => res.json())
        ]);
        setStats({
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
    { title: 'Tổng số Bài viết', value: stats.posts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/posts' },
    { title: 'Tổng số Sản phẩm', value: stats.products, icon: Package, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/products' },
    { title: 'Vị trí Tuyển dụng', value: stats.careers, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/careers' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tổng quan (Dashboard)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.bg}`}>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lối tắt</h2>
        <div className="flex gap-4">
          <Link href="/admin/posts/new" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
            + Thêm bài viết mới
          </Link>
          <Link href="/admin/settings" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Settings className="w-5 h-5" /> Cấu hình hệ thống
          </Link>
        </div>
      </div>
    </div>
  );
}
