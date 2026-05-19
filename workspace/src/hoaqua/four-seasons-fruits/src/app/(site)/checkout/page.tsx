"use client";

// Checkout Page with promo code support

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/actions/order-actions";
import { applyPromoCode } from "@/actions/promotion-actions";
import { applyVoucher, recordVoucherUsage } from "@/actions/voucher-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ShoppingBag, Minus, Plus, Trash2, Tag, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart, updateQuantity, removeItem } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Promo/Voucher code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    name: string;
    maxDiscount: number | null;
    type: "promotion" | "voucher";
    voucherId?: string;
    discountType?: string;
    discountAmount?: number;
  } | null>(null);
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-200 mb-4 animate-pulse" />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="h-20 w-20 mx-auto text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-2">
          Mã đơn hàng: <span className="font-mono font-medium">{orderId}</span>
        </p>
        <p className="text-gray-600 mb-6">
          Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
        </p>
        <Link href="/products">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
        <p className="text-gray-600 mb-6">Hãy thêm sản phẩm trước khi thanh toán</p>
        <Link href="/products">
          <Button className="bg-emerald-600 hover:bg-emerald-700">Mua sắm ngay</Button>
        </Link>
      </div>
    );
  }

  // Calculate totals
  const subtotal = getTotalPrice();
  const promoDiscount = appliedPromo
    ? appliedPromo.discountAmount ?? Math.min(
        Math.round(subtotal * (appliedPromo.discount / 100)),
        appliedPromo.maxDiscount || Infinity
      )
    : 0;
  const finalTotal = Math.max(0, subtotal - promoDiscount);

  // Apply promo/voucher code - tries voucher first, then promotion
  const handleApplyCode = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingCode(true);
    const code = promoCode.trim().toUpperCase();

    // Try as voucher first
    const email = (document.getElementById("email") as HTMLInputElement)?.value || "";
    const voucherResult = await applyVoucher(code, email, subtotal);

    if (voucherResult.success && voucherResult.voucher) {
      const v = voucherResult.voucher;
      setAppliedPromo({
        code,
        discount: v.discountValue,
        name: v.description || `Giảm ${v.discountType === "percent" ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()}đ`}`,
        maxDiscount: v.maxDiscount,
        type: "voucher",
        voucherId: v.id,
        discountType: v.discountType,
        discountAmount: v.discountAmount,
      });
      toast.success(`Áp dụng voucher "${code}" thành công!`);
      setPromoCode("");
      setIsApplyingCode(false);
      return;
    }

    // Try as promotion code
    const promoResult = await applyPromoCode(code);
    if (promoResult.success && promoResult.promotion) {
      setAppliedPromo({
        code,
        discount: promoResult.promotion.discount,
        name: promoResult.promotion.name,
        maxDiscount: promoResult.promotion.maxDiscount,
        type: "promotion",
      });
      toast.success(`Áp dụng mã "${code}" thành công! Giảm ${promoResult.promotion.discount}%`);
      setPromoCode("");
      setIsApplyingCode(false);
      return;
    }

    // Both failed
    toast.error(voucherResult.error || "Mã không hợp lệ hoặc đã hết hạn");
    setIsApplyingCode(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.info("Đã hủy mã khuyến mại");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const result = await createOrder({
      customerName: formData.get("name") as string,
      customerEmail: formData.get("email") as string,
      customerPhone: formData.get("phone") as string,
      shippingAddress: formData.get("address") as string,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.salePrice ?? item.price,
      })),
      total: finalTotal,
    });

    if (result.success) {
      // Record voucher usage if applied
      if (appliedPromo?.type === "voucher" && appliedPromo.voucherId && result.orderId) {
        const email = (document.getElementById("email") as HTMLInputElement)?.value || "";
        await recordVoucherUsage(appliedPromo.voucherId, email, result.orderId, promoDiscount);
      }

      setOrderId(result.orderId || "");
      setOrderSuccess(true);
      clearCart();
      toast.success("Đặt hàng thành công!");
    } else {
      toast.error(result.error || "Đặt hàng thất bại");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-xl border bg-white space-y-4">
              <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input id="name" name="name" required placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input id="phone" name="phone" required placeholder="0123 456 789" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="email@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                <Textarea id="address" name="address" required placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố" rows={3} />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-xl"
            >
              {isSubmitting ? "Đang xử lý..." : `Đặt hàng • ${formatPrice(finalTotal)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Items */}
            <div className="p-5 rounded-xl border bg-white">
              <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatPrice(item.salePrice ?? item.price)}/{item.unit}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold">{formatPrice((item.salePrice ?? item.price) * item.quantity)}</span>
                      <button type="button" onClick={() => { removeItem(item.id); toast.info(`Đã xóa "${item.name}"`); }} className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="p-5 rounded-xl border bg-white">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-orange-500" />
                Mã khuyến mại
              </h3>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-orange-700">{appliedPromo.code}</p>
                    <p className="text-xs text-orange-600">{appliedPromo.name} • Giảm {appliedPromo.discount}%</p>
                  </div>
                  <button onClick={handleRemovePromo} className="p-1 text-orange-500 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Nhập mã..."
                    className="uppercase"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCode(); } }}
                  />
                  <Button
                    type="button"
                    onClick={handleApplyCode}
                    disabled={isApplyingCode || !promoCode.trim()}
                    variant="outline"
                    className="shrink-0"
                  >
                    {isApplyingCode ? "..." : "Áp dụng"}
                  </Button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="p-5 rounded-xl border bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>
                      {appliedPromo?.type === "voucher" ? "Voucher" : "Khuyến mại"}{" "}
                      ({appliedPromo?.discountType === "fixed"
                        ? `${appliedPromo.discount.toLocaleString()}đ`
                        : `-${appliedPromo?.discount}%`})
                    </span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="text-emerald-600">Miễn phí</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-emerald-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
