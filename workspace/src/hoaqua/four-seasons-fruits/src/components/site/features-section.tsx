"use client";

// Features section with stagger animations

import { Truck, Clock, Leaf, Award } from "lucide-react";
import { StaggerContainer, StaggerItem, FadeUp } from "@/components/ui/motion";

const features = [
  {
    icon: Leaf,
    title: "100% Tự nhiên",
    description: "Trái cây được trồng theo phương pháp hữu cơ, không hóa chất độc hại.",
    color: "from-emerald-500 to-green-400",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Giao hàng trong 2 giờ tại nội thành, đảm bảo tươi ngon.",
    color: "from-orange-500 to-amber-400",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Award,
    title: "Chất lượng cao",
    description: "Tuyển chọn kỹ lưỡng từ những vùng trồng tốt nhất.",
    color: "from-yellow-500 to-amber-400",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    icon: Clock,
    title: "Phục vụ 7 ngày",
    description: "Mở cửa mỗi ngày, sẵn sàng phục vụ bạn bất cứ lúc nào.",
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              Tại sao chọn chúng tôi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Tại sao chọn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                Four Seasons?
              </span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Chúng tôi cam kết mang đến cho bạn những trái cây tươi ngon nhất
              với dịch vụ tốt nhất.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group relative p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Gradient top border */}
                <div className={`absolute top-0 left-8 right-8 h-1 rounded-b-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bgColor} mb-5`}>
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
