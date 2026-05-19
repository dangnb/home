"use client";

// Cart Page - Full page view of cart items

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-200 mb-4 animate-pulse" />
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
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
        </p>
        <Link href="/products">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
        <Button variant="outline" size="sm" onClick={clearCart}>
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl border bg-white"
            >
              {/* Image */}
              <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    🍎
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-emerald-600 font-medium">
                  {formatPrice(item.salePrice ?? item.price)}/{item.unit}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Subtotal & Remove */}
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <p className="font-semibold text-gray-900">
                  {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl border bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-emerald-600">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-emerald-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Tiến hành thanh toán
              </Button>
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600 hover:text-emerald-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
