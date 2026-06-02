import type { Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  name: string;
  category: string;
  price: string;
  unitPrice: number;
  quantity: number;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
  note?: string;
  fulfillment: "pickup" | "delivery";
  payment: "cash" | "transfer";
};

export function parseVndPrice(price: string) {
  return Number(price.replace(/\D/g, "")) || 0;
}

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function createCartItem(product: Product, quantity = 1): CartItem {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    unitPrice: parseVndPrice(product.price),
    quantity,
  };
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}
