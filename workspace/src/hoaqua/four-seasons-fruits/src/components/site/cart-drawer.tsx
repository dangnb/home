"use client";

// Cart Drawer - slides in from the right with smooth animations

import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-emerald-50 to-white">
          <SheetTitle className="flex items-center gap-2.5 text-lg">
            <div className="p-2 rounded-lg bg-emerald-100">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
            </div>
            Giỏ hàng
            <span className="text-sm font-normal text-gray-500">
              ({items.length} sản phẩm)
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">Giỏ hàng trống</p>
            <p className="text-sm text-gray-500 mt-1">Hãy thêm sản phẩm vào giỏ hàng</p>
            <Button
              onClick={closeCart}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-emerald-100 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-orange-50 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍎
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-sm text-emerald-600 font-bold mt-0.5">
                        {formatPrice(item.salePrice ?? item.price)}
                        <span className="text-xs font-normal text-gray-400">/{item.unit}</span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-7 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="self-start p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Footer */}
            <div className="border-t bg-gray-50/50 px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Tổng cộng:</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Miễn phí giao hàng cho đơn trên 200.000đ</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={closeCart}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Xem giỏ hàng
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-xl shadow-sm">
                    Thanh toán
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
