import { Product } from '@/types/models';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAdd: (product: Product) => void;
}

export const ProductGrid = ({ products, loading, onAdd }: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="aspect-square skeleton" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-3 w-1/2" />
              <div className="flex justify-between items-center pt-1">
                <div className="skeleton h-5 w-20" />
                <div className="skeleton h-9 w-9 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="font-bold text-lg text-gray-700 mb-1">Không tìm thấy sản phẩm</h3>
        <p className="text-sm">Danh mục này chưa có sản phẩm hoặc đã tạm hết.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {products.map((product, i) => (
        <div key={product.id} className={`animate-fadeInUp`} style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s`, opacity: 0 }}>
          <ProductCard product={product} onAdd={onAdd} />
        </div>
      ))}
    </div>
  );
};
