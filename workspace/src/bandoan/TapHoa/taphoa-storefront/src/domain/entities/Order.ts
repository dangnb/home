import { CartItem } from './Cart';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'momo' | 'vnpay' | 'banking';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. WTH-88231
  shippingAddress: ShippingAddress;
  deliveryTimeSlot: string; // e.g. 'Giao ngay trong 2 giờ', '8h - 12h Sáng mai'
  paymentMethod: PaymentMethod;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  discountCode?: string;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
