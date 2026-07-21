export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  costPrice?: number;
  wholesalePrice?: number;
  mainImageUrl?: string;
  additionalImages?: string[];
  stockQuantity?: number;
  unit?: string;
  categoryName?: string;
  categoryId?: string;
  supplierName?: string;
  barcode?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
