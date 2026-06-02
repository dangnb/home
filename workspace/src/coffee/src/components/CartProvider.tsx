"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { createCartItem, getCartItemCount, getCartSubtotal, type CartItem } from "@/lib/cart";

const CART_STORAGE_KEY = "moc-coffee-cart-v1";
const MAX_QUANTITY = 99;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQuantity(quantity: number) {
  return Math.min(Math.max(Math.round(quantity), 1), MAX_QUANTITY);
}

function isCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const maybeItem = item as CartItem;
  return (
    typeof maybeItem.slug === "string" &&
    typeof maybeItem.name === "string" &&
    typeof maybeItem.category === "string" &&
    typeof maybeItem.price === "string" &&
    typeof maybeItem.unitPrice === "number" &&
    typeof maybeItem.quantity === "number"
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart) as { items?: unknown };
          if (Array.isArray(parsed.items)) {
            setItems(parsed.items.filter(isCartItem).map((item) => ({ ...item, quantity: clampQuantity(item.quantity) })));
          }
        }
      } catch {
        setItems([]);
      } finally {
        setHasHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
  }, [hasHydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      itemCount: getCartItemCount(items),
      subtotal: getCartSubtotal(items),
      isOpen,
      hasHydrated,
      addItem(product, quantity = 1) {
        const safeQuantity = clampQuantity(quantity);
        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.slug === product.slug);

          if (!existingItem) {
            return [...currentItems, createCartItem(product, safeQuantity)];
          }

          return currentItems.map((item) =>
            item.slug === product.slug ? { ...item, quantity: clampQuantity(item.quantity + safeQuantity) } : item,
          );
        });
        setIsOpen(true);
      },
      removeItem(slug) {
        setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
      },
      updateQuantity(slug, quantity) {
        if (quantity <= 0) {
          setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
          return;
        }

        setItems((currentItems) => currentItems.map((item) => (item.slug === slug ? { ...item, quantity: clampQuantity(quantity) } : item)));
      },
      clearCart() {
        setItems([]);
      },
      openCart() {
        setIsOpen(true);
      },
      closeCart() {
        setIsOpen(false);
      },
      toggleCart() {
        setIsOpen((current) => !current);
      },
    };
  }, [hasHydrated, isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
