import { Order, ShippingAddress, PaymentMethod } from '../entities/Order';
import { CartItem } from '../entities/Cart';

export interface CreateOrderDTO {
  shippingAddress: ShippingAddress;
  deliveryTimeSlot: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  discountCode?: string;
}

export interface IOrderRepository {
  createOrder(dto: CreateOrderDTO): Promise<Order>;
  trackOrder(orderId: string, phone: string): Promise<Order | null>;
}
