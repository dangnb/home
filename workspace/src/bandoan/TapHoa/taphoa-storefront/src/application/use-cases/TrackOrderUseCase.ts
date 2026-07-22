import { IOrderRepository } from '@/domain/repositories/IOrderRepository';

export class TrackOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string, phone: string) {
    if (!orderId || !phone) {
      throw new Error('Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại');
    }
    return this.orderRepository.trackOrder(orderId.trim(), phone.trim());
  }
}
