'use client';
import { ShieldCheck, Truck, Heart, Users, Leaf, Award } from 'lucide-react';

const values = [
  { icon: <Leaf className="w-6 h-6" />, title: 'Tươi sạch', desc: 'Nhập hàng trực tiếp từ nông trại mỗi sáng' },
  { icon: <Truck className="w-6 h-6" />, title: 'Giao nhanh', desc: 'Cam kết giao trong 2 giờ nội thành' },
  { icon: <ShieldCheck className="w-6 h-6" />, title: 'Chất lượng', desc: '100% sản phẩm qua kiểm tra chất lượng' },
  { icon: <Heart className="w-6 h-6" />, title: 'Tận tâm', desc: 'Đổi trả miễn phí, hoàn tiền nếu không hài lòng' },
];

const milestones = [
  { year: '2020', event: 'Thành lập TạpHóa với 50 sản phẩm đầu tiên' },
  { year: '2021', event: 'Mở rộng hợp tác với 20+ nhà cung cấp uy tín' },
  { year: '2022', event: 'Ra mắt website và ứng dụng đặt hàng online' },
  { year: '2023', event: 'Đạt 5.000 khách hàng thân thiết' },
  { year: '2024', event: 'Mở rộng giao hàng toàn thành phố' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="text-6xl block mb-4">🏪</span>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Về TạpHóa</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          TạpHóa là nền tảng mua sắm thực phẩm tươi sống trực tuyến, kết nối người tiêu dùng với các nguồn cung uy tín. 
          Chúng tôi tin rằng mọi gia đình đều xứng đáng có bữa ăn tươi ngon với giá hợp lý.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 md:p-10 text-white mb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-xl font-black mb-3">Sứ mệnh của chúng tôi</h2>
          <p className="text-emerald-100 leading-relaxed">
            Đem đến cho mỗi gia đình Việt Nam nguồn thực phẩm tươi sạch, an toàn với giá cả minh bạch. 
            Chúng tôi hợp tác trực tiếp với nông trại và nhà cung cấp để loại bỏ trung gian, 
            giúp bạn tiết kiệm thời gian và chi phí mua sắm hàng ngày.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-12">
        <h2 className="text-xl font-black text-gray-800 text-center mb-6">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 text-center card-hover">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
                {v.icon}
              </div>
              <h3 className="font-bold text-sm text-gray-800 mb-1">{v.title}</h3>
              <p className="text-xs text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <h2 className="text-xl font-black text-gray-800 text-center mb-6">Hành trình phát triển</h2>
        <div className="max-w-xl mx-auto space-y-0">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">
                  {m.year.slice(2)}
                </div>
                {i < milestones.length - 1 && <div className="w-0.5 h-full bg-emerald-200 min-h-[2rem]" />}
              </div>
              <div className="pb-6">
                <span className="text-xs font-bold text-emerald-600">{m.year}</span>
                <p className="text-sm text-gray-700 font-medium">{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { num: '1000+', label: 'Sản phẩm' },
          { num: '5000+', label: 'Khách hàng' },
          { num: '20+', label: 'Nhà cung cấp' },
          { num: '4.9⭐', label: 'Đánh giá' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-5 text-center">
            <div className="text-2xl font-black text-emerald-600">{s.num}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
