"use client";

import FadeIn from "../animations/FadeIn";

export default function AboutSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Giới Thiệu Về{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Xe Ghép Nam Định
            </span>
          </h2>
        </FadeIn>

        <div className="prose prose-lg max-w-none">
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dịch vụ xe ghép Nam Định là gì?</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Dịch vụ xe ghép Nam Định (còn gọi là đi chung xe) hiểu đơn giản là bạn sẽ thuê và đi chung một chuyến xe
              với một hoặc vài khách khác để tiết kiệm chi phí thuê xe. Số lượng khách trên xe chỉ khoảng 2 – 5 người,
              không chen chúc như xe khách.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ưu điểm của xe ghép</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Đón tận nhà, trả tận nơi - không cần ra bến xe
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Xe rộng rãi, thoải mái, ít bị say xe
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Tiết kiệm đến 40-50% chi phí so với taxi riêng
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Đi thẳng từ điểm đón đến điểm đến, không dừng đón khách liên tục
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                Phù hợp cho người ốm, người già, trẻ nhỏ
              </li>
            </ul>
          </FadeIn>

          <FadeIn delay={0.3}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Về chúng tôi</h3>
            <p className="text-gray-600 leading-relaxed">
              Xe Ghép Nam Định (xeghepnamdinh.vn) với kinh nghiệm quản lý và điều phối xe ghép chuyên tuyến
              Hà Nội – Nam Định trong suốt 5 năm qua. Chúng tôi cam kết mang đến dịch vụ chất lượng tốt nhất,
              đa dạng loại xe với giá cả hợp lý, giúp quý khách hàng cảm thấy thoải mái và an toàn trong suốt chuyến đi.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
