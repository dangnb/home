import { IOrderRepository, CreateOrderDTO } from '@/domain/repositories/IOrderRepository';
import { checkoutSchema } from '../validators/checkoutValidator';

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(dto: CreateOrderDTO) {
    // 1. Security Check: Validate shipping address with Zod
    const validationResult = checkoutSchema.safeParse({
      fullName: dto.shippingAddress.fullName,
      phone: dto.shippingAddress.phone,
      city: dto.shippingAddress.city,
      district: dto.shippingAddress.district,
      ward: dto.shippingAddress.ward,
      street: dto.shippingAddress.street,
      deliveryTimeSlot: dto.deliveryTimeSlot,
      paymentMethod: dto.paymentMethod,
      discountCode: dto.discountCode,
      note: dto.shippingAddress.note
    });

    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }

    if (!dto.items || dto.items.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống!');
    }

    // 2. Pass down to repository
    return this.orderRepository.createOrder(dto);
  }
}
