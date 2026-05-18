"use client";

import { Phone, Check } from "lucide-react";
import Link from "next/link";
import FadeIn from "../animations/FadeIn";
import StaggerContainer, { StaggerItem } from "../animations/StaggerContainer";

const pricingCards = [
  { name: "Xe Ghép Hà Nội Nam Định", price: "250.000đ", unit: "/ Ghế", popular: true, vehicle: "xe-ghep", route: "Hà Nội → Nam Định" },
  { name: "Taxi Hà Nội Nam Định 4 Chỗ", price: "900.000đ", unit: "/ Xe", popular: false, vehicle: "taxi-4", route: "Hà Nội → Nam Định" },
  { name: "Taxi Hà Nội Nam Định 7 Chỗ", price: "1.100.000đ", unit: "/ Xe", popular: false, vehicle: "taxi-7", route: "Hà Nội → Nam Định" },
  { name: "Xe Ghép Nam Định Nội Bài", price: "450.000đ", unit: "/ Ghế", popular: true, vehicle: "xe-ghep", route: "Nam Định → Nội Bài" },
  { name: "Taxi Nội Bài Nam Định 4 Chỗ", price: "1.100.000đ", unit: "/ Xe", popular: false, vehicle: "taxi-4", route: "Nội Bài → Nam Định" },
  { name: "Taxi Nội Bài Nam Định 7 Chỗ", price: "1.300.000đ", unit: "/ Xe", popular: false, vehicle: "taxi-7", route: "Nội Bài → Nam Định" },
];

const priceTable = [
  { route: "Xe Ghép Hà Nội Giao Thuỷ", price: "250.000đ/Người", link: "Hà Nội → Giao Thủy" },
  { route: "Xe Ghép Hà Nội Xuân Trường", price: "250.000đ/Người", link: "Hà Nội → Xuân Trường" },
  { route: "Xe Ghép Hà Nội Hải Hậu", price: "250.000đ/Người", link: "Hà Nội → Hải Hậu" },
  { route: "Xe Ghép Hà Nội Trực Ninh", price: "250.000đ/Người", link: "Hà Nội → Trực Ninh" },
  { route: "Xe Ghép Hà Nội Nam Trực", price: "250.000đ/Người", link: "Hà Nội → Nam Trực" },
  { route: "Xe Ghép Hà Nội Nghĩa Hưng", price: "250.000đ/Người", link: "Hà Nội → Nghĩa Hưng" },
  { route: "Xe Ghép Hà Nội Ý Yên", price: "250.000đ/Người", link: "Hà Nội → Ý Yên" },
  { route: "Xe Ghép Hà Nội Vụ Bản", price: "250.000đ/Người", link: "Hà Nội → Vụ Bản" },
  { route: "Xe Ghép Hà Nội Mỹ Lộc", price: "250.000đ/Người", link: "Hà Nội → Mỹ Lộc" },
];

export default function PricingSection() {
  return (
    <section id="bang-gia" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Bảng Giá{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Xe Ghép Nam Định
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Giá đã bao gồm phí cầu đường bến bãi - Cam kết 100% xe riêng đời mới, đưa đón tại nhà - Miễn phí huỷ chuyến
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {pricingCards.map((card, index) => (
            <StaggerItem key={index}>
              <div
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  card.popular
                    ? "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                {card.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                    PHỔ BIẾN
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-lg">{card.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-blue-900">{card.price}</span>
                  <span className="text-gray-500 text-sm">{card.unit}</span>
                </div>
                <ul className="mt-5 space-y-2">
                  {["Đưa đón tận nhà", "Xe đời mới", "Miễn phí hủy"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={14} className="text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/dat-ve?route=${encodeURIComponent(card.route)}&vehicle=${card.vehicle}`}
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    card.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  <Phone size={16} />
                  Đặt xe ngay
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Price Table */}
        <FadeIn delay={0.3} className="mt-16">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="bg-blue-900 px-6 py-4">
              <h3 className="text-white font-bold text-lg">Bảng giá chi tiết theo huyện</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {priceTable.map((item, index) => (
                <Link
                  key={index}
                  href={`/dat-ve?route=${encodeURIComponent(item.link)}&vehicle=xe-ghep`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-gray-700 font-medium group-hover:text-blue-700">{item.route}</span>
                  <span className="text-orange-600 font-bold">{item.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
