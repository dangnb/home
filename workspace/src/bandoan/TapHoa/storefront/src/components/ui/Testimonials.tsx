'use client';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Chị Hương',
    avatar: '👩',
    location: 'Quận 1, TP.HCM',
    rating: 5,
    text: 'Rau củ tươi xanh, giao hàng nhanh chỉ 1 tiếng. Rất hài lòng với dịch vụ!',
  },
  {
    name: 'Anh Minh',
    avatar: '👨',
    location: 'Quận 7, TP.HCM',
    rating: 5,
    text: 'Trái cây nhập khẩu chất lượng, giá rẻ hơn siêu thị. Sẽ mua tiếp!',
  },
  {
    name: 'Chị Lan',
    avatar: '👩‍🦱',
    location: 'Bình Thạnh, TP.HCM',
    rating: 4,
    text: 'Đặt hàng dễ dàng, nhân viên giao hàng thân thiện. Sản phẩm đúng mô tả.',
  },
];

export default function Testimonials() {
  return (
    <section>
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-gray-800">Khách hàng nói gì?</h2>
        <p className="text-sm text-gray-400 mt-1">Hơn 5.000 khách hàng tin tưởng mua sắm tại TạpHóa</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl p-5 relative group card-hover"
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8 text-emerald-100 group-hover:text-emerald-200 transition-colors" />

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {t.avatar}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400">{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
