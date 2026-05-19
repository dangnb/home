"use client";

// Public promotions display with animations

import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Percent, Clock, Tag, Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  discount: number;
  type: string;
  code: string | null;
  startDate: string;
  endDate: string;
  minOrder: number | null;
  maxDiscount: number | null;
  appliesTo: string[];
  isUpcoming: boolean;
}

export function PromotionsContent({ promotions }: { promotions: Promotion[] }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold border border-orange-100 shadow-sm mb-6">
              <Gift className="h-4 w-4" />
              Ưu đãi đặc biệt
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Chương trình{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                khuyến mại
              </span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
              Nhanh tay tận hưởng những ưu đãi hấp dẫn từ Four Seasons Fruits
            </p>
          </motion.div>
        </div>
      </section>

      {/* Promotions List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {promotions.length === 0 ? (
            <FadeUp>
              <div className="text-center py-16">
                <Percent className="h-16 w-16 mx-auto text-gray-200 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">
                  Hiện chưa có chương trình khuyến mại
                </h2>
                <p className="text-gray-500 mt-2">
                  Hãy quay lại sau để xem các ưu đãi mới nhất!
                </p>
              </div>
            </FadeUp>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <StaggerItem key={promo.id}>
                  <PromotionCard promo={promo} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}

function PromotionCard({ promo }: { promo: Promotion }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (promo.code) {
      navigator.clipboard.writeText(promo.code);
      setCopied(true);
      toast.success(`Đã copy mã: ${promo.code}`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isActive = !promo.isUpcoming;
  const endDate = new Date(promo.endDate);
  const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
      promo.isUpcoming
        ? "bg-gray-50 border-gray-200"
        : "bg-white border-orange-100 hover:border-orange-200"
    }`}>
      {/* Discount badge */}
      <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl font-bold text-white text-lg ${
        promo.isUpcoming ? "bg-gray-400" : "bg-gradient-to-r from-orange-500 to-red-500"
      }`}>
        -{promo.discount}%
      </div>

      {/* Content */}
      <div className="pr-16">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{promo.name}</h3>
        {promo.description && (
          <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2.5 mt-4">
        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-orange-500 shrink-0" />
          {promo.isUpcoming ? (
            <span>Bắt đầu: {new Date(promo.startDate).toLocaleDateString("vi-VN")}</span>
          ) : (
            <span>
              Còn <strong className="text-orange-600">{daysLeft}</strong> ngày
              (đến {endDate.toLocaleDateString("vi-VN")})
            </span>
          )}
        </div>

        {/* Applies to */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <Tag className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            {promo.type === "all"
              ? "Áp dụng cho tất cả sản phẩm"
              : `Áp dụng: ${promo.appliesTo.slice(0, 3).join(", ")}${promo.appliesTo.length > 3 ? ` +${promo.appliesTo.length - 3}` : ""}`}
          </span>
        </div>

        {/* Min order */}
        {promo.minOrder && (
          <div className="text-xs text-gray-500">
            Đơn tối thiểu: {formatPrice(promo.minOrder)}
          </div>
        )}

        {/* Max discount */}
        {promo.maxDiscount && (
          <div className="text-xs text-gray-500">
            Giảm tối đa: {formatPrice(promo.maxDiscount)}
          </div>
        )}
      </div>

      {/* Promo Code */}
      {promo.code && isActive && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 font-mono text-sm font-bold text-orange-700 text-center tracking-wider">
              {promo.code}
            </div>
            <button
              onClick={copyCode}
              className="p-2.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              title="Copy mã"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Upcoming badge */}
      {promo.isUpcoming && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Sắp diễn ra
          </span>
        </div>
      )}
    </div>
  );
}
