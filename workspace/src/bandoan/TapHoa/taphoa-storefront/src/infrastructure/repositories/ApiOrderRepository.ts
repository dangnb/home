/**
 * API Order Repository
 * Implements IOrderRepository using real REST API calls to .NET backend
 */

import { IOrderRepository, CreateOrderDTO } from '@/domain/repositories/IOrderRepository';
import { Order } from '@/domain/entities/Order';
import { httpClient } from '@/infrastructure/http/httpClient';
import { ApiConfig } from '@/infrastructure/config/api.config';
import { ApiOrderDTO, toOrder, mapPaymentMethodToEnum } from '@/infrastructure/adapters/orderAdapter';

export class ApiOrderRepository implements IOrderRepository {
  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const fullAddress = [
      dto.shippingAddress.street,
      dto.shippingAddress.ward,
      dto.shippingAddress.district,
      dto.shippingAddress.city,
    ]
      .filter(Boolean)
      .join(', ');

    const requestBody = {
      customerName: dto.shippingAddress.fullName,
      customerPhone: dto.shippingAddress.phone,
      customerAddress: fullAddress,
      items: dto.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      paymentMethod: mapPaymentMethodToEnum(dto.paymentMethod),
      notes: [
        dto.deliveryTimeSlot ? `[Khung giờ: ${dto.deliveryTimeSlot}]` : '',
        dto.shippingAddress.note ? `[Ghi chú: ${dto.shippingAddress.note}]` : '',
        dto.discountCode ? `[Mã giảm giá: ${dto.discountCode}]` : '',
      ]
        .filter(Boolean)
        .join(' '),
      pointsToUse: 0,
    };

    const response = await httpClient.post<{ orderId: string } | ApiOrderDTO>(
      ApiConfig.endpoints.orders.create,
      requestBody,
    );

    const orderId = ('orderId' in response ? response.orderId : (response as ApiOrderDTO).id) || 'ORDER-SUCCESS';

    // Return dummy Order entity with server orderId
    return {
      id: orderId,
      shippingAddress: dto.shippingAddress,
      deliveryTimeSlot: dto.deliveryTimeSlot || 'Giao tiêu chuẩn',
      paymentMethod: (dto.paymentMethod as any) || 'cod',
      items: dto.items,
      totalAmount: dto.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      shippingFee: 0,
      discountCode: dto.discountCode,
      discountAmount: 0,
      finalAmount: dto.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
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
      return null;
    }
  }
}
