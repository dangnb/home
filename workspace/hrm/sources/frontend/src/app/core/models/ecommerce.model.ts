export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  thumbnail: string;
  qty: number;
  price: number;
  rating: number;
  status: 'Published' | 'Scheduled' | 'Inactive';
  statusColor: 'success' | 'warning' | 'danger';
  category: string;
  selected?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
  icon: string;
  iconBg: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAvatar?: string;
  customerEmail: string;
  status: 'Completed' | 'Pending' | 'Processing' | 'Cancelled' | 'Delivered';
  statusColor: 'success' | 'warning' | 'primary' | 'danger' | 'info';
  total: number;
  date: string;
  paymentMethod: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  initialsColor?: string;
  status: 'Active' | 'Locked' | 'Disabled';
  statusColor: 'success' | 'warning' | 'danger';
  country: string;
  countryFlag: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  selected?: boolean;
}

