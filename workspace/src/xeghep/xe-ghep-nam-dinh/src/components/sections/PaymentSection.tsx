"use client";

import { Banknote, CreditCard, Building, Smartphone, Clock } from "lucide-react";
import FadeIn from "../animations/FadeIn";
import StaggerContainer, { StaggerItem } from "../animations/StaggerContainer";

const payments = [
  {
    icon: Banknote,
    title: "Tiền Mặt",
    description: "Thanh toán trực tiếp cho lái xe sau khi kết thúc hành trình.",
  },
  {
    icon: CreditCard,
    title: "Chuyển Khoản",
    description: "Chuyển khoản trực tiếp cho lái xe hoặc cho công ty.",
  },
  {
    icon: Building,
    title: "Tại Văn Phòng",
    description: "Đến văn phòng thanh toán và quyết toán hợp đồng + hóa đơn VAT.",
  },
  {
    icon: Smartphone,
    title: "Trực Tuyến",
    description: "Thanh toán qua Momo, Viettel Pay, Zalo Pay, Paypal.",
  },
  {
    icon: Clock,
    title: "Trả Sau",
    description: "Áp dụng cho doanh nghiệp có hợp đồng với chúng tôi.",
  },
];

export default function PaymentSection() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Hình Thức{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Thanh Toán
            </span>
          </h2>
          <p className="mt-4 text-gray-600">Đa dạng phương thức thanh toán, thuận tiện cho mọi khách hàng</p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {payments.map((payment, index) => (
            <StaggerItem key={index}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <payment.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{payment.title}</h3>
                <p className="text-gray-600 text-sm">{payment.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
