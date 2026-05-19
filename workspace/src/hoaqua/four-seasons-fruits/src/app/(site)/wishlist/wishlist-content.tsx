"use client";

// Wishlist page content

import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { toggleWishlist } from "@/actions/wishlist-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    image: string | null;
    unit: string;
    category: string | null;
  };
}

export function WishlistContent({ items }: { items: WishlistItem[] }) {
  const router = useRouter();

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    toast.success("Đã bỏ khỏi yêu thích");
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeUp>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm yêu thích</h1>
        <p className="text-gray-600 mb-8">{items.length} sản phẩm</p>
      </FadeUp>

      {items.length === 0 ? (
        <FadeUp>
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Chưa có sản phẩm yêu thích</h2>
            <p className="text-gray-500 mt-2 mb-6">Nhấn ❤️ trên sản phẩm để lưu vào đây</p>
            <Link href="/products">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Khám phá sản phẩm</Button>
            </Link>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition-shadow">
                {/* Image */}
                <Link href={`/products/${item.product.slug}`} className="shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center text-3xl overflow-hidden">
                    {item.product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      "🍊"
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {item.product.category && (
                    <p className="text-xs text-emerald-600 font-semibold uppercase">{item.product.category}</p>
                  )}
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-gray-900 truncate hover:text-emerald-600 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {formatPrice(item.product.salePrice ?? item.product.price)}
                    <span className="text-gray-400 font-normal">/{item.product.unit}</span>
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Bỏ yêu thích"
                >
                  <Heart className="h-5 w-5 fill-red-400" />
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
