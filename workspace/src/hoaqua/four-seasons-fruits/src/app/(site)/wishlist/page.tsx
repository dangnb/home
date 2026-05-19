// Wishlist Page - Shows customer's saved products

import { getCustomerSession } from "@/actions/customer-auth-actions";
import { getWishlist } from "@/actions/wishlist-actions";
import { redirect } from "next/navigation";
import { WishlistContent } from "./wishlist-content";

export default async function WishlistPage() {
  const customer = await getCustomerSession();

  if (!customer) {
    redirect("/auth");
  }

  const wishlistItems = await getWishlist();

  return (
    <WishlistContent
      items={wishlistItems.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          salePrice: item.product.salePrice,
          image: item.product.image,
          unit: item.product.unit,
          category: item.product.category?.name || null,
        },
      }))}
    />
  );
}
