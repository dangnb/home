"use client";

// Checkout Page - Customer fills in shipping info and places order

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/actions/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart, updateQuantity, removeItem } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-200 mb-4 animate-pulse" />
      </div>
    );
  }
  const [orderId, setOrderId] = useState("");

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Giỏ hàng trống
        </h1>
        <p className="text-gray-600 mb-6">
          Hãy thêm sản phẩm trước khi thanh toán
        </p>
        <Link href="/products">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Mua sắm ngay
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const customerName = formData.get("name") as string;
    const customerEmail = formData.get("email") as string;
    const customerPhone = formData.get("phone") as string;
    const shippingAddress = formData.get("address") as string;

    const result = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.salePrice ?? item.price,
      })),
      total: getTotalPrice(),
    });

    if (result.success) {
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
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    placeholder="0123 456 789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                <Textarea
                  id="address"
                  name="address"
                  required
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố"
                  rows={3}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl border bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(item.salePrice ?? item.price)}/{item.unit}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(
                        (item.salePrice ?? item.price) * item.quantity
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.id);
                        toast.info(`Đã xóa "${item.name}" khỏi giỏ hàng`);
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-emerald-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-emerald-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
