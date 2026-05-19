"use client";

// Wishlist (heart) button - toggles product in wishlist
// Requires customer login

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/actions/wishlist-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  isInWishlist: boolean;
  isLoggedIn: boolean;
  size?: "sm" | "lg";
}

export function WishlistButton({ productId, isInWishlist: initialState, isLoggedIn, size = "sm" }: WishlistButtonProps) {
  const [isWished, setIsWished] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để lưu yêu thích");
      router.push("/auth");
      return;
    }

    setIsLoading(true);
    const result = await toggleWishlist(productId);

    if (result.success) {
      setIsWished(result.isInWishlist);
      toast.success(result.isInWishlist ? "Đã thêm vào yêu thích ❤️" : "Đã bỏ khỏi yêu thích");
    } else {
      toast.error(result.error || "Thao tác thất bại");
    }
    setIsLoading(false);
  };

  const sizeClasses = size === "lg"
    ? "w-11 h-11"
    : "w-8 h-8";

  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${sizeClasses} rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 ${
        isWished
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      } ${isLoading ? "opacity-50" : ""}`}
      title={isWished ? "Bỏ yêu thích" : "Thêm yêu thích"}
    >
      <Heart className={`${iconSize} ${isWished ? "fill-red-500" : ""}`} />
    </button>
  );
}
