'use client';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Giao nhanh 2h',
    desc: 'Nội thành TP.HCM',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả dễ dàng',
    desc: 'Trong vòng 24h',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Thanh toán an toàn',
    desc: 'Bảo mật 100%',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    desc: 'Hotline 1900 1234',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

export default function TrustBadges() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {badges.map((badge, i) => (
        <div
          key={badge.title}
          className={`flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:shadow-md transition-all duration-300 animate-fadeInUp stagger-${i + 1}`}
        >
          <div className={`${badge.bg} ${badge.color} p-3 rounded-xl flex-shrink-0`}>
            <badge.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-800">{badge.title}</div>
            <div className="text-xs text-gray-500">{badge.desc}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
