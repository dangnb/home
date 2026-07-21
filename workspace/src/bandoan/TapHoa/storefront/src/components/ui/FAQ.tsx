'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Thời gian giao hàng mất bao lâu?',
    a: 'Chúng tôi giao hàng trong vòng 2 giờ cho khu vực nội thành. Đơn hàng ngoại thành sẽ được giao trong 4-6 giờ. Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi".',
  },
  {
    q: 'Làm sao để đổi trả sản phẩm?',
    a: 'Bạn có thể yêu cầu đổi trả trong vòng 24 giờ sau khi nhận hàng. Liên hệ hotline 1900 1234 hoặc chat trực tiếp trên website. Hoàn tiền 100% nếu sản phẩm không đúng mô tả.',
  },
  {
    q: 'Có chương trình tích điểm không?',
    a: 'Có! Mỗi 10.000₫ mua sắm bạn nhận 1 điểm. Tích lũy đủ điểm để đổi voucher giảm giá, quà tặng và nhiều ưu đãi hấp dẫn.',
  },
  {
    q: 'Sản phẩm có đảm bảo tươi ngon không?',
    a: 'Tất cả rau củ, trái cây và thực phẩm tươi sống đều được nhập trực tiếp từ nông trại và chợ đầu mối mỗi sáng. Chúng tôi cam kết 100% tươi ngon hoặc hoàn tiền.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-gray-800">Câu hỏi thường gặp</h2>
        <p className="text-sm text-gray-400 mt-1">Giải đáp thắc mắc của bạn</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
            >
              <span className="font-bold text-sm text-gray-800 pr-4">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === i ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
