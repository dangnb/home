import { Order } from '@/domain/entities/Order';
import { IOrderRepository, CreateOrderDTO } from '@/domain/repositories/IOrderRepository';

let inMemoryOrders: Order[] = [
  {
    id: 'WTH-1001',
    shippingAddress: {
      fullName: 'Nguyễn Văn An',
      phone: '0912345678',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      street: '123 Nguyễn Huệ',
      note: 'Giao giờ hành chính'
    },
    deliveryTimeSlot: 'Giao nhanh 2h',
    paymentMethod: 'cod',
    items: [
      {
        product: {
          id: 'prod-1',
          name: 'Sữa Tươi Tiệt Trùng Vinamilk 100% Có Đường 1L',
          slug: 'sua-tuoi-tiet-trung-vinamilk-100-co-duong-1l',
          price: 36000,
          categoryId: 'cat-4',
          categoryName: 'Đồ Uống',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
          unit: 'Hộp 1L',
          stock: 100,
          rating: 4.9,
          soldCount: 100,
          description: ''
        },
        quantity: 2
      }
    ],
    totalAmount: 72000,
    shippingFee: 15000,
    discountAmount: 10000,
    finalAmount: 77000,
    status: 'shipping',
    createdAt: new Date().toISOString()
  }
];

export class MockOrderRepository implements IOrderRepository {
  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const totalAmount = dto.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingFee = totalAmount >= 150000 ? 0 : 15000;
    const discountAmount = dto.discountCode === 'TAPHOA10' ? 10000 : 0;
    const finalAmount = Math.max(0, totalAmount + shippingFee - discountAmount);

    const randomId = 'WTH-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      id: randomId,
      shippingAddress: dto.shippingAddress,
      deliveryTimeSlot: dto.deliveryTimeSlot,
      paymentMethod: dto.paymentMethod,
      items: dto.items,
      totalAmount,
      shippingFee,
      discountCode: dto.discountCode,
      discountAmount,
      finalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    inMemoryOrders.unshift(newOrder);
    return newOrder;
  }

  async trackOrder(orderId: string, phone: string): Promise<Order | null> {
    const found = inMemoryOrders.find(
      o => o.id.toLowerCase() === orderId.toLowerCase() && o.shippingAddress.phone.endsWith(phone.slice(-4))
    );
    return found || null;
  }
}
