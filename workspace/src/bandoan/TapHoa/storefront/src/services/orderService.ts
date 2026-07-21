import { apiClient } from '@/lib/apiClient';
import { PagedResult } from './productService';

export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  paymentMethod: number;
  loggedInCustomerId: string | null;
  pointsToUse: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export const orderService = {
  createOrder: async (payload: OrderPayload): Promise<{ orderId: string }> => {
    return apiClient.post<{ orderId: string }>('/online-store/orders', payload);
  },

  getMyOrders: async (pageIndex = 1, pageSize = 50): Promise<PagedResult<any>> => {
    return apiClient.get<PagedResult<any>>(`/online-store/orders/me?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
};
