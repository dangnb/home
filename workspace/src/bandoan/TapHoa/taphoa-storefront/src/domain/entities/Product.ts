export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  categoryId: string;
  categoryName: string;
  image: string;
  images?: string[]; // Gallery images (additional product photos)
  unit: string; // e.g. '500g', '1kg', 'Chai 1L', 'Hộp', 'Túi 500g'
  stock: number;
  rating: number;
  soldCount: number;
  description: string;
  origin?: string; // Nguồn gốc xuất xứ: Việt Nam, Nhật Bản, v.v.
  isFlashSale?: boolean;
  isPopular?: boolean;
}
