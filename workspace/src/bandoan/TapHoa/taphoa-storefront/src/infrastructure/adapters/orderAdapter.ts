/**
 * Order Adapter
 * Maps API DTOs to Domain Entities for .NET Backend
 */

import { Order, ShippingAddress } from '@/domain/entities/Order';
import { CartItem } from '@/domain/entities/Cart';

export interface ApiOrderItemDTO {
  productId?: string;
  product_id?: string;
  productName?: string;
  product_name?: string;
  productImage?: string;
  product_image?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  unit?: string;
}

export interface ApiOrderDTO {
  id: string;
  orderId?: string;
  code?: string;
  orderCode?: string;
  customerName?: string;
  customer_name?: string;
  customerPhone?: string;
  customer_phone?: string;
  customerAddress?: string;
  shippingAddress?: string;
  shipping_address?: string;
  items?: ApiOrderItemDTO[];
  totalAmount?: number;
  total_amount?: number;
  shippingFee?: number;
  shipping_fee?: number;
  discountAmount?: number;
  discount_amount?: number;
  finalAmount?: number;
  final_amount?: number;
  paymentMethod?: string | number;
  payment_method?: string | number;
  notes?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
}

export function mapPaymentMethodToEnum(method: string): number {
  switch (method?.toLowerCase()) {
    case 'cod':
    case 'cash':
      return 0; // Cash
    case 'bank':
    case 'banktransfer':
    case 'transfer':
      return 1; // BankTransfer
    case 'card':
    case 'creditcard':
      return 2; // CreditCard
    case 'ewallet':
    case 'momo':
    case 'vnpay':
      return 3; // EWallet
    default:
      return 0;
  }
}

// DTO → Domain Entity
export function toOrder(dto: ApiOrderDTO): Order {
  const customerName = dto.customerName ?? dto.customer_name ?? 'Khách hàng';
  const customerPhone = dto.customerPhone ?? dto.customer_phone ?? '';
  const street = dto.customerAddress ?? dto.shippingAddress ?? dto.shipping_address ?? '';

  const shippingAddress: ShippingAddress = {
    fullName: customerName,
    phone: customerPhone,
    city: '',
    district: '',
    ward: '',
    street: street,
    note: dto.notes,
  };

  const items: CartItem[] = (dto.items || []).map((item) => {
    const id = item.productId || item.product_id || '';
    const name = item.productName || item.product_name || 'Sản phẩm';
    const image = item.productImage || item.product_image || '/images/placeholder.jpg';
    const price = item.unitPrice ?? item.price ?? 0;
    const unit = item.unit || 'Cái';

    return {
      product: {
        id: id,
        name: name,
        slug: id,
        price: price,
        categoryId: '',
        categoryName: '',
        image: image,
        unit: unit,
        stock: 0,
        rating: 5,
        soldCount: 0,
        description: '',
      },
      quantity: item.quantity,
    };
  });

  const orderId = dto.id || dto.orderId || dto.code || dto.orderCode || 'ORDER-UNKNOWN';

  return {
    id: orderId,
    shippingAddress,
    deliveryTimeSlot: 'Nhanh',
    paymentMethod: typeof dto.paymentMethod === 'string' ? (dto.paymentMethod as any) : 'COD',
    items,
    totalAmount: dto.totalAmount ?? dto.total_amount ?? 0,
    shippingFee: dto.shippingFee ?? dto.shipping_fee ?? 0,
    discountCode: undefined,
    discountAmount: dto.discountAmount ?? dto.discount_amount ?? 0,
    finalAmount: dto.finalAmount ?? dto.final_amount ?? (dto.totalAmount ?? dto.total_amount ?? 0),
    status: (dto.status as any) || 'pending',
    createdAt: dto.createdAt ?? dto.created_at ?? new Date().toISOString(),
  };
}
