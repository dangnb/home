"use client";

import { Banknote, Package, Shield, Car } from "lucide-react";
import FadeIn from "../animations/FadeIn";
import StaggerContainer, { StaggerItem } from "../animations/StaggerContainer";

const services = [
  {
    icon: Banknote,
    title: "Tiết Kiệm 50%",
    description:
      "Tiết kiệm được từ 30% đến 50% chi phí khi di chuyển từ Hà Nội về Nam Định và ngược lại.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Package,
    title: "Giá Trọn Gói",
    description:
      "Khách hàng luôn biết trước chi phí trọn gói, không phát sinh cho mỗi chuyến đi.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "Cam Kết Dịch Vụ",
    description:
      "Cam kết 100% xe riêng đời mới, đưa đón tại nhà, luôn đúng giờ, lái xe chuyên nghiệp.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Car,
    title: "Đa Dạng Dịch Vụ",
    description:
      "Xe ghép, gửi hàng siêu tốc, vận chuyển xe máy, cho thuê xe du lịch theo yêu cầu.",
    color: "from-orange-500 to-red-500",
  },
];

export default function ServicesSection() {
  return (
    <section id="dich-vu" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Dịch Vụ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Xe Ghép Nam Định
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đa dạng dịch vụ vận chuyển hành khách và hàng hóa giữa Hà Nội và Nam Định
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <service.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
