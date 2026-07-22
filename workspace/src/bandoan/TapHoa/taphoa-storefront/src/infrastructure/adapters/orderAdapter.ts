/**
 * Order Adapter
 * Maps API DTOs to Domain Entities
 */

import { Order, ShippingAddress } from '@/domain/entities/Order';
import { CartItem } from '@/domain/entities/Cart';

export interface ApiOrderItemDTO {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface ApiOrderDTO {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_ward?: string;
  shipping_district?: string;
  shipping_city?: string;
  items: ApiOrderItemDTO[];
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  discount_code?: string;
  final_amount: number;
  delivery_time_slot: string;
  payment_method: string;
  note?: string;
  status: string;
  created_at: string;
}

export interface ApiCreateOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_ward?: string;
  shipping_district?: string;
  shipping_city?: string;
  items: { product_id: string; quantity: number }[];
  coupon_code?: string;
  delivery_time_slot: string;
  payment_method: string;
  note?: string;
}

// DTO → Domain Entity
export function toOrder(dto: ApiOrderDTO): Order {
  const shippingAddress: ShippingAddress = {
    fullName: dto.customer_name,
    phone: dto.customer_phone,
    city: dto.shipping_city || '',
    district: dto.shipping_district || '',
    ward: dto.shipping_ward || '',
    street: dto.shipping_address,
    note: dto.note,
  };

  const items: CartItem[] = dto.items.map((item) => ({
    product: {
      id: item.product_id,
      name: item.product_name,
      slug: '',
      price: item.price,
      categoryId: '',
      categoryName: '',
      image: item.product_image,
      unit: item.unit,
      stock: 0,
      rating: 0,
      soldCount: 0,
      description: '',
    },
    quantity: item.quantity,
  }));

  return {
    id: dto.id,
    shippingAddress,
    deliveryTimeSlot: dto.delivery_time_slot,
    paymentMethod: dto.payment_method as Order['paymentMethod'],
    items,
    totalAmount: dto.total_amount,
    shippingFee: dto.shipping_fee,
    discountCode: dto.discount_code,
    discountAmount: dto.discount_amount,
    finalAmount: dto.final_amount,
    status: dto.status as Order['status'],
    createdAt: dto.created_at,
  };
}

