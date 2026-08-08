'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import CategoryNav from '../components/CategoryNav';
import FilterSortBar, { SortOption } from '../components/FilterSortBar';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import CartDrawer, { CartItem } from '../components/CartDrawer';
import FloatingActions from '../components/FloatingActions';
import OrderTrackerModal, { OrderDetails } from '../components/OrderTrackerModal';
import Footer from '../components/Footer';
import { PRODUCTS, CATEGORIES, Product } from '../data/products';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterDiscountOnly, setFilterDiscountOnly] = useState<boolean>(false);
  const [filterHighRating, setFilterHighRating] = useState<boolean>(false);
  const [filterUnder50k, setFilterUnder50k] = useState<boolean>(false);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);

  // Active Order & Tracker Modal
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);

  // Load cart & favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('trikun_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedFavs = localStorage.getItem('trikun_favorites');
      if (savedFavs) {
        setFavoriteIds(JSON.parse(savedFavs));
      }
      const savedOrder = localStorage.getItem('trikun_active_order');
      if (savedOrder) {
        setActiveOrder(JSON.parse(savedOrder));
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trikun_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trikun_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  }, [favoriteIds]);

  // Save active order to localStorage
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('trikun_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('trikun_active_order');
      }
    } catch (e) {
      console.error('Error saving active order:', e);
    }
  }, [activeOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Toggle favorite dish
  const handleToggleFavorite = (product: Product) => {
    if (favoriteIds.includes(product.id)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích.`);
    } else {
      setFavoriteIds((prev) => [...prev, product.id]);
      showToast(`Đã thêm "${product.name}" vào danh sách yêu thích ❤️!`);
    }
  };

  // Reset filter controls
  const handleResetFilters = () => {
    setSortBy('default');
    setFilterDiscountOnly(false);
    setFilterHighRating(false);
    setFilterUnder50k(false);
    setFilterFavoritesOnly(false);
  };

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDiscount = !filterDiscountOnly || product.discount > 0;
      const matchesRating = !filterHighRating || product.rating >= 4.8;
      const matchesUnder50k = !filterUnder50k || product.price < 50000;
      const matchesFavorite = !filterFavoritesOnly || favoriteIds.includes(product.id);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesDiscount &&
        matchesRating &&
        matchesUnder50k &&
        matchesFavorite
      );
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestseller') {
      list = [...list].sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [
    activeCategory,
    searchQuery,
    filterDiscountOnly,
    filterHighRating,
    filterUnder50k,
    filterFavoritesOnly,
    favoriteIds,
    sortBy,
  ]);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : 'Tất cả';

  // Quick add to cart
  const handleQuickAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && !item.spicyLevel
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity: 1,
          itemUnitPrice: product.price,
        };
        return [...prev, newItem];
      }
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Detailed add to cart with options
  const handleAddToCartWithOptions = (
    product: Product,
    quantity: number,
    options: { spicyLevel: string; addOns: string[] }
  ) => {
    const addOnsTotal = options.addOns.reduce((sum, name) => {
      if (name.includes('phô mai')) return sum + 8000;
      if (name.includes('trứng')) return sum + 10000;
      if (name.includes('BBQ')) return sum + 5000;
      return sum;
    }, 0);

    const itemUnitPrice = product.price + addOnsTotal;

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product,
      quantity,
      spicyLevel: options.spicyLevel,
      addOns: options.addOns,
      itemUnitPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order Placed handler
  const handleOrderPlaced = (order: OrderDetails) => {
    setActiveOrder(order);
    setIsOrderTrackerOpen(true);
    showToast(`Đặt hàng thành công! Đơn #${order.orderId} đang được xử lý.`);
  };

  // Claim Promo Code from Hero Banner
  const handleApplyPromoCodeFromBanner = (code: string) => {
    setAppliedPromoCode(code);
    setIsCartOpen(true);
    showToast(`Đã chọn mã giảm giá "${code}". Tiến hành đặt hàng ngay!`);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Search, Cart Counter & Order Tracker Link */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrder={activeOrder}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
      />

      {/* Hero Banner Carousel */}
      <HeroBanner
        onApplyPromoCode={handleApplyPromoCodeFromBanner}
        onSelectCategory={setActiveCategory}
      />

      {/* Horizontal Category Navigation Bar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Filter and Sorting Toolbar */}
      <FilterSortBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterDiscountOnly={filterDiscountOnly}
        setFilterDiscountOnly={setFilterDiscountOnly}
        filterHighRating={filterHighRating}
        setFilterHighRating={setFilterHighRating}
        filterUnder50k={filterUnder50k}
        setFilterUnder50k={setFilterUnder50k}
        filterFavoritesOnly={filterFavoritesOnly}
        setFilterFavoritesOnly={setFilterFavoritesOnly}
        favoriteCount={favoriteIds.length}
        onResetFilters={handleResetFilters}
      />

      {/* Main Product Grid */}
      <div className="flex-1 py-4">
        <ProductGrid
          products={filteredProducts}
          onOpenDetails={(prod) => setSelectedProduct(prod)}
          onAddToCart={handleQuickAddToCart}
          activeCategoryName={activeCategoryName}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Floating Action Buttons (Account & Chat) */}
      <FloatingActions />

      {/* Product Quick View Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* Slide-over Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        appliedPromoCode={appliedPromoCode}
      />

      {/* Order Tracker Timeline Modal */}
      <OrderTrackerModal
        order={isOrderTrackerOpen ? activeOrder : null}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
