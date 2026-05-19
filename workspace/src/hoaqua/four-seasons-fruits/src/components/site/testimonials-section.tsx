"use client";

// Customer Testimonials with card animations

import { Star, Quote } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    role: "Khách hàng thân thiết",
    content:
      "Trái cây ở đây luôn tươi ngon, giao hàng nhanh. Mình đã mua ở đây hơn 1 năm rồi và rất hài lòng!",
    rating: 5,
    avatar: "👩",
  },
  {
    name: "Trần Văn Hùng",
    role: "Khách hàng mới",
    content:
      "Lần đầu đặt hàng và rất ấn tượng với chất lượng. Xoài và bơ rất ngon, đóng gói cẩn thận.",
    rating: 5,
    avatar: "👨",
  },
  {
    name: "Lê Thị Hương",
    role: "Khách hàng VIP",
    content:
      "Dịch vụ tuyệt vời! Nhân viên tư vấn nhiệt tình, sản phẩm đa dạng. Combo quà tặng rất đẹp.",
    rating: 5,
    avatar: "👩‍💼",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-white">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              Đánh giá
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Khách hàng{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                nói gì?
              </span>
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Hơn 10,000 khách hàng tin tưởng và yêu thích
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <div className="relative p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-12 w-12 text-emerald-600" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 text-[15px]">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                  <div className="text-3xl bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-emerald-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
