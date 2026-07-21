'use client';
import { useEffect, useState, use } from 'react';
import { ShoppingCart, ArrowLeft, Plus, Minus, Truck, ShieldCheck, RotateCcw, ChevronLeft, ChevronRight, Check, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/models';
import { productService } from '@/services/productService';
import { useToast } from '@/components/ui/ToastProvider';
import RelatedProducts from '@/components/features/products/RelatedProducts';
import Link from 'next/link';

function getImageUrl(url: string) {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:5222${url}`;
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const decodedSlug = decodeURIComponent(resolvedParams.slug);
        const data = await productService.getProductBySlug(decodedSlug);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.slug]);

  // Build image gallery array
  const allImages: string[] = [];
  if (product?.mainImageUrl) allImages.push(product.mainImageUrl);
  if (product?.additionalImages) {
    product.additionalImages.forEach(img => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      mainImageUrl: product.mainImageUrl
    }, quantity);
    showToast(`Đã thêm "${product.name}" x${quantity} vào giỏ hàng`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const navigateImage = (dir: 'prev' | 'next') => {
    if (allImages.length <= 1) return;
    setSelectedImage(prev => {
      if (dir === 'prev') return prev === 0 ? allImages.length - 1 : prev - 1;
      return prev === allImages.length - 1 ? 0 : prev + 1;
    });
  };

  // ===== Loading Skeleton =====
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 animate-fadeIn">
        <div className="skeleton h-4 w-24 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="skeleton aspect-square rounded-2xl mb-4" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="skeleton w-20 h-20 rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4 py-4">
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-12 w-40 mt-6" />
            <div className="skeleton h-14 w-full mt-6" />
            <div className="skeleton h-32 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  // ===== Not Found =====
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fadeInUp">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-black text-gray-800 mb-3">Sản phẩm không tồn tại</h1>
        <p className="text-gray-500 mb-6">Sản phẩm này có thể đã bị xóa hoặc không còn trên hệ thống.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 animate-fadeIn">
      {/* Breadcrumb */}
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại cửa hàng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ===== Left: Image Gallery ===== */}
        <div className="animate-fadeInUp stagger-1">
          {/* Main Image */}
          <div className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center group shadow-sm">
            {allImages.length > 0 ? (
              <img
                src={getImageUrl(allImages[selectedImage])}
                alt={product.name}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="text-[120px] select-none">📦</span>
            )}

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold px-6 py-2 rounded-full text-sm shadow-lg">Tạm hết hàng</span>
              </div>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
                {selectedImage + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                    selectedImage === i 
                      ? 'border-emerald-500 shadow-md shadow-emerald-100 ring-2 ring-emerald-200' 
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== Right: Product Info ===== */}
        <div className="flex flex-col animate-fadeInUp stagger-2">
          {/* Category badge */}
          <div className="mb-3">
            <span className="inline-flex items-center bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {product.categoryName || 'Sản phẩm'}
            </span>
          </div>

          {/* Product name */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-4">
            {product.barcode && (
              <span>SKU: <span className="font-mono text-gray-500">{product.barcode}</span></span>
            )}
            {product.stockQuantity !== undefined && product.stockQuantity > 0 && (
              <span className="text-emerald-600 font-medium">✓ Còn {product.stockQuantity} {product.unit || 'sản phẩm'}</span>
            )}
          </div>

          {/* Supplier Info Card */}
          {product.supplierName && (
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🏪</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">Nhà cung cấp</div>
                <div className="font-bold text-gray-800 text-sm truncate">{product.supplierName}</div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md uppercase">
                  ✓ Đối tác
                </span>
              </div>
            </div>
          )}

          {/* Product Specs */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 mb-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Danh mục</span>
                <span className="font-medium text-gray-800">{product.categoryName || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Đơn vị</span>
                <span className="font-medium text-gray-800">{product.unit || '—'}</span>
              </div>
              {product.supplierName && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Nguồn gốc</span>
                  <span className="font-medium text-gray-800">{product.supplierName}</span>
                </div>
              )}
              {product.barcode && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Mã vạch</span>
                  <span className="font-mono font-medium text-gray-800 text-xs">{product.barcode}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Tình trạng</span>
                <span className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-emerald-600'}`}>
                  {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Bảo quản</span>
                <span className="font-medium text-gray-800">Nơi khô ráo</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-emerald-50/80 rounded-2xl p-5 mb-6 border border-emerald-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-black text-emerald-600">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
              {product.unit && (
                <span className="text-base text-gray-500 font-medium">/ {product.unit}</span>
              )}
              {product.wholesalePrice && product.wholesalePrice > product.price && (
                <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm animate-pulse">
                  -{Math.round(((product.wholesalePrice - product.price) / product.wholesalePrice) * 100)}%
                </span>
              )}
            </div>
            {product.wholesalePrice && product.wholesalePrice > product.price && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">
                  {product.wholesalePrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xs text-red-500 font-bold">
                  Tiết kiệm {(product.wholesalePrice - product.price).toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}
            {product.wholesalePrice && product.wholesalePrice < product.price && (
              <div className="text-sm text-gray-500 mt-1">
                Giá sỉ: <span className="font-semibold">{product.wholesalePrice.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
          </div>

          {/* Quantity + Add to cart */}
          {!isOutOfStock ? (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-l-xl hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center text-lg font-bold text-gray-800 select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-r-xl hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`flex-1 font-bold text-base rounded-xl flex items-center justify-center gap-2.5 py-3.5 transition-all duration-300 active:scale-[0.98] ${
                  addedToCart
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200/50 hover:shadow-xl'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-500 font-bold text-center py-4 rounded-xl mb-6 border border-gray-200">
              <Package className="w-5 h-5 inline mr-2" />
              Sản phẩm tạm hết hàng
            </div>
          )}

          {/* Trust info */}
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-800">Giao hàng siêu tốc</div>
                <div className="text-xs text-gray-500">Nhận hàng trong 2 giờ nội thành</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-800">Cam kết chính hãng</div>
                <div className="text-xs text-gray-500">100% sản phẩm chất lượng cao</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-800">Đổi trả miễn phí</div>
                <div className="text-xs text-gray-500">Hoàn tiền trong 24h nếu không hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Product Description Section ===== */}
      <div className="mt-10 md:mt-14 animate-fadeInUp">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {/* Tab header */}
          <div className="border-b border-gray-100 px-6">
            <div className="flex gap-6">
              <button className="py-4 text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 -mb-px">
                Mô tả sản phẩm
              </button>
              <button className="py-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                Đánh giá
              </button>
            </div>
          </div>
          {/* Tab content */}
          <div className="p-6 md:p-8">
            {product.description ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📝</div>
                <h4 className="font-bold text-gray-700 mb-1">Chưa có mô tả</h4>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Sản phẩm <strong>{product.name}</strong> hiện chưa có thông tin mô tả chi tiết. 
                  Vui lòng liên hệ hotline <span className="text-emerald-600 font-medium">1900 1234</span> để được tư vấn thêm.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products - lazy loaded */}
      <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
    </div>
  );
}
