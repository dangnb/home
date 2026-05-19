"use client";

// Add to Cart button for product detail page
// Includes quantity selector

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    image: string | null;
    unit: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`Đã thêm ${quantity} ${product.unit} "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Số lượng:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={disabled}
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {disabled ? "Hết hàng" : "Thêm vào giỏ hàng"}
      </Button>
    </div>
  );
}
