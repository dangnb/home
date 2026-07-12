export enum PaymentMethod {
  Cash = 1,
  BankTransfer = 2,
  Card = 3,
  Debt = 4
}

export enum OrderStatus {
  Pending = 1,
  Completed = 2,
  Cancelled = 3
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderCommand {
  customerId?: string | null;
  items: OrderItemDto[];
  discountAmount: number;
  promotionId?: string | null;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  pointsToUse?: number;
}

export interface OrderDto {
  id: string;
  orderCode: string;
  customerId?: string;
  customerName?: string;
  orderDate: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdBy: string;
  notes?: string;
}
