'use client';
import { useEffect, useState } from 'react';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore, Product } from '@/store/cartStore';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5222/api/v1/online-store/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3 mt-8"></div>
            <div className="h-32 bg-gray-200 rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h1>
        <Link href="/" className="text-emerald-600 hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const p: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.mainImageUrl
    };
    addItem(p, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-white rounded-3xl border flex items-center justify-center p-8">
            {product.mainImageUrl ? (
              <img 
                src={product.mainImageUrl.startsWith('http') ? product.mainImageUrl : `http://localhost:5222${product.mainImageUrl}`} 
                alt={product.name} 
                className="w-full h-full object-contain" 
              />
            ) : (
              <span className="text-9xl">📦</span>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-2 text-emerald-600 font-bold uppercase tracking-wider text-sm">
            {product.categoryName || 'Sản phẩm'}
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="text-sm text-gray-500 mb-8">
            Mã sản phẩm: <span className="font-mono">{product.barcode || product.id.split('-')[0]}</span>
            {product.supplierName && <span className="ml-4">| Cung cấp bởi: {product.supplierName}</span>}
          </div>
          
          <div className="text-4xl font-black text-emerald-600 mb-8">
            {product.price.toLocaleString('vi-VN')}₫
            <span className="text-lg text-gray-500 font-normal ml-2">/ {product.unit}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border-2 rounded-2xl p-2 bg-white w-full sm:w-auto">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-16 text-center text-xl font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-emerald-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 py-4 sm:py-0"
            >
              <ShoppingCart className="w-6 h-6" />
              Thêm vào giỏ hàng
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold mb-2">Thông tin thêm</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Cam kết hàng chính hãng 100%
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Giao hàng siêu tốc trong 2 giờ
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Đổi trả dễ dàng trong 7 ngày
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
