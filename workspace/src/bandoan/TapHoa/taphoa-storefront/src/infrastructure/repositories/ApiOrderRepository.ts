/**
 * API Order Repository
 * Implements IOrderRepository using real REST API calls
 */

import { IOrderRepository, CreateOrderDTO } from '@/domain/repositories/IOrderRepository';
import { Order } from '@/domain/entities/Order';
import { httpClient } from '@/infrastructure/http/httpClient';
import { ApiConfig } from '@/infrastructure/config/api.config';
import { ApiOrderDTO, toOrder } from '@/infrastructure/adapters/orderAdapter';

export class ApiOrderRepository implements IOrderRepository {
  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const requestBody = {
      customer_name: dto.shippingAddress.fullName,
      customer_phone: dto.shippingAddress.phone,
      shipping_address: dto.shippingAddress.street,
      shipping_ward: dto.shippingAddress.ward,
      shipping_district: dto.shippingAddress.district,
      shipping_city: dto.shippingAddress.city,
      delivery_time_slot: dto.deliveryTimeSlot,
      payment_method: dto.paymentMethod,
      items: dto.items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      coupon_code: dto.discountCode,
      note: dto.shippingAddress.note,
    };

    const response = await httpClient.post<ApiOrderDTO>(
      ApiConfig.endpoints.orders.create,
      requestBody,
    );

    return toOrder(response);
  }

  async trackOrder(orderId: string, phone: string): Promise<Order | null> {
    try {
      const response = await httpClient.get<ApiOrderDTO>(
        ApiConfig.endpoints.orders.tracking,
        {
          params: {
            code: orderId,
            phone,
          },
        },
      );

      return toOrder(response);
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error && (error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}
