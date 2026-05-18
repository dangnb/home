"use client";

import { useEffect, useState } from "react";
import { FileText, Car, DollarSign, Settings } from "lucide-react";

interface Stats {
  posts: number;
  services: number;
  prices: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, services: 0, prices: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [postsRes, servicesRes, pricesRes] = await Promise.all([
          fetch("/api/posts?limit=1"),
          fetch("/api/services"),
          fetch("/api/prices"),
        ]);
        const postsData = await postsRes.json();
        const servicesData = await servicesRes.json();
        const pricesData = await pricesRes.json();

        setStats({
          posts: postsData.pagination?.total || 0,
          services: servicesData.services?.length || 0,
          prices: pricesData.prices?.length || 0,
        });
      } catch (error) {
        console.error("Fetch stats error:", error);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Bài viết", value: stats.posts, icon: FileText, color: "bg-blue-500" },
    { label: "Dịch vụ", value: stats.services, icon: Car, color: "bg-green-500" },
    { label: "Bảng giá", value: stats.prices, icon: DollarSign, color: "bg-orange-500" },
    { label: "Cấu hình", value: "—", icon: Settings, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn nhanh</h2>
        <ul className="space-y-3 text-gray-600">
          <li>• <strong>Bài viết:</strong> Quản lý blog, tin tức SEO cho website</li>
          <li>• <strong>Dịch vụ:</strong> Thêm/sửa/xóa các dịch vụ hiển thị trên trang chủ</li>
          <li>• <strong>Bảng giá:</strong> Cập nhật giá xe ghép theo tuyến</li>
          <li>• <strong>Cấu hình:</strong> Thay đổi thông tin liên hệ, pixel tracking, SEO mặc định</li>
        </ul>
      </div>
    </div>
  );
}
