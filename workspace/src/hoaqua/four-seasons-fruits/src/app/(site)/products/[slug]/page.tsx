// Product Detail Page with image gallery, rich content, comments, wishlist

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { applyPromotionsToProducts } from "@/lib/promotion";
import { getCustomerSession } from "@/actions/customer-auth-actions";
import { getProductComments } from "@/actions/comment-actions";
import { isInWishlist } from "@/actions/wishlist-actions";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductComments } from "@/components/site/product-comments";
import { WishlistButton } from "@/components/site/wishlist-button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Parse images array
  let imageList: string[] = [];
  if (product.images) {
    try {
      imageList = JSON.parse(product.images);
    } catch {
      imageList = [];
    }
  }
  // Fallback to single image
  if (imageList.length === 0 && product.image) {
    imageList = [product.image];
  }

  // Apply promotions
  const [productWithPromo] = await applyPromotionsToProducts([product]);
  const { effectivePrice, discountPercent, hasPromotion } = productWithPromo;

  // Get comments and customer session
  const [comments, customer] = await Promise.all([
    getProductComments(product.id),
    getCustomerSession(),
  ]);
  const wished = customer ? await isInWishlist(product.id) : false;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại sản phẩm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Product Images Gallery */}
        <ProductImageGallery
          images={imageList}
          productName={product.name}
          isOnSale={product.isOnSale}
          discountPercent={discountPercent}
        />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.id}`}
                className="text-sm text-emerald-600 font-semibold uppercase tracking-wider hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
              <WishlistButton
                productId={product.id}
                isInWishlist={wished}
                isLoggedIn={!!customer}
                size="lg"
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            {effectivePrice < product.price ? (
              <>
                <span className="text-3xl font-bold text-red-500">
                  {formatPrice(effectivePrice)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge className={`border-0 ${hasPromotion ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                  {hasPromotion ? `KM -${discountPercent}%` : `Tiết kiệm ${formatPrice(product.price - effectivePrice)}`}
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-gray-500">/{product.unit}</span>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                ✓ Còn hàng ({product.stock} {product.unit})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                ✗ Hết hàng
              </Badge>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>
          )}

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              salePrice: effectivePrice < product.price ? effectivePrice : product.salePrice,
              image: product.image,
              unit: product.unit,
            }}
            disabled={product.stock <= 0}
          />

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            {[
              { emoji: "🚚", text: "Giao hàng nhanh 30 phút" },
              { emoji: "✅", text: "Đảm bảo tươi ngon" },
              { emoji: "🔄", text: "Đổi trả trong 24h" },
              { emoji: "💯", text: "Cam kết chính hãng" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-sm text-gray-600">
                <span>{badge.emoji}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rich Content Section */}
      {product.content && (
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Thông tin chi tiết
          </h2>
          <div
            className="product-content max-w-none"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />
        </div>
      )}

      {/* Comments Section */}
      <ProductComments
        productId={product.id}
        comments={comments}
        currentCustomerId={customer?.id || null}
      />
    </div>
  );
}
