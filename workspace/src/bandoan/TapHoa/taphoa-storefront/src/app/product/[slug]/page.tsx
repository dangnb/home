'use client';

import { use, useEffect, useState } from 'react';
import { getProductRepository } from '@/infrastructure/di/container';
import { GetProductsUseCase } from '@/application/use-cases/GetProductsUseCase';
import { Product } from '@/domain/entities/Product';
import { useCartStore } from '@/presentation/store/useCartStore';
import { useToastStore } from '@/presentation/store/useToastStore';
import { ProductCard } from '@/presentation/components/features/ProductCard';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, Plus, Minus, ArrowLeft, Heart, Share2, Check, Tag } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/presentation/components/ui/ProductImage';

const productRepo = getProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepo);

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const found = await getProductsUseCase.getBySlug(slug);
      if (found) {
        setProduct(found);
        const related = await getProductsUseCase.execute({ categoryId: found.categoryId, pageSize: 5 });
        setRelatedProducts(related.items.filter(p => p.id !== found.id));
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-lg" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-8 bg-gray-100 rounded w-2/5" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Sản phẩm không tồn tại</h2>
        <p className="text-xs text-gray-400">Sản phẩm bạn đang tìm kiếm có thể đã ngưng bán hoặc đổi liên kết.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00904a] text-white rounded-lg font-bold text-xs shadow-md hover:bg-[#007a3e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`Đã thêm ${quantity} x "${product.name}" vào giỏ hàng`);
  };

  // Build gallery images: use product.images if available, otherwise generate variants from main image
  const galleryImages = (() => {
    if (product.images && product.images.length > 0) {
      return [product.image, ...product.images];
    }
    // Generate visual variants by changing Unsplash crop params
    const base = product.image;
    if (base.includes('unsplash.com')) {
      return [
        base,
        base.replace('fit=crop', 'fit=crop&crop=top'),
        base.replace('fit=crop', 'fit=crop&crop=center'),
        base.replace('fit=crop', 'fit=crop&crop=bottom'),
      ];
    }
    return [base];
  })();


  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#00904a]">Trang chủ</Link>
        <span>/</span>
        <Link href={`/collections/${product.categoryId}`} className="hover:text-[#00904a]">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product view */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Left: Image Gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100 group">
            <ProductImage
              src={galleryImages[selectedImage] || product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.discountPercent && (
              <span className="absolute top-3 left-3 bg-gradient-to-b from-[#ff424e] to-[#ee2d38] text-white font-black text-xs px-2.5 py-1.5 rounded-lg shadow-md">
                -{product.discountPercent}%
              </span>
            )}
            {/* Image counter */}
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
              {selectedImage + 1} / {galleryImages.length}
            </span>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  i === selectedImage
                    ? 'border-[#00904a] shadow-md ring-1 ring-[#00904a]/30'
                    : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                <ProductImage src={img} alt={`${product.name} - ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="bg-green-100 text-[#00904a] text-[11px] font-bold px-2.5 py-1 rounded-md">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">| {product.soldCount.toLocaleString('vi-VN')} đã bán</span>
            </div>
          </div>

          {/* Product name */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Price */}
          <div className="bg-green-50 rounded-lg p-4 flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-black text-[#e60000]">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            {product.discountPercent && (
              <span className="text-xs font-bold text-[#e60000] bg-red-100 px-2 py-0.5 rounded">
                Tiết kiệm {(product.originalPrice! - product.price).toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>

          {/* Specs */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-20 flex-shrink-0">Quy cách:</span>
              <span className="font-semibold text-gray-800">{product.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-20 flex-shrink-0">Xuất xứ:</span>
              <span className="font-semibold text-gray-800">{product.origin || 'Việt Nam'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-20 flex-shrink-0">Tình trạng:</span>
              {product.stock > 0 ? (
                <span className="font-semibold text-[#00904a] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Còn hàng ({product.stock})</span>
              ) : (
                <span className="font-semibold text-red-500">Hết hàng</span>
              )}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="pt-3 space-y-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-gray-800 border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#00904a] hover:bg-[#007a3e] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4" />
                THÊM VÀO GIỎ HÀNG
              </button>
              <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-300 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#00904a]" />
              <span>Giao 2H nội thành</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#00904a]" />
              <span>100% Chính hãng</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-[#00904a]" />
              <span>Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 md:p-8 space-y-3">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#00904a]" />
          Mô Tả Sản Phẩm
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description}
        </p>
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p><strong>Lưu ý:</strong> Hình ảnh sản phẩm mang tính chất minh họa. Bao bì thực tế có thể thay đổi theo từng đợt sản xuất.</p>
          <p><strong>Bảo quản:</strong> Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.</p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="border-b-2 border-[#00904a] pb-0.5">SẢN PHẨM CÙNG DANH MỤC</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
