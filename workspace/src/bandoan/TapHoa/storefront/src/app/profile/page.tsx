'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Package, Calendar, MapPin, Phone, CreditCard } from 'lucide-react';
import { orderService } from '@/services/orderService';

export default function ProfilePage() {
  const { customer, token } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer || !token) {
      router.push('/');
      return;
    }

    async function fetchOrders() {
      try {
        const result = await orderService.getMyOrders(1, 50);
        setOrders(result.items || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [customer, token, router]);

  if (!customer) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 border shadow-sm sticky top-24 text-center">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black text-4xl mx-auto mb-4">
              {customer.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold mb-1">{customer.fullName}</h2>
            <p className="text-gray-500 mb-6">{customer.phoneNumber}</p>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="text-xs text-gray-500 mb-1">Hạng thành viên</div>
                <div className="font-bold text-gray-800">{customer.tier}</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl">
                <div className="text-xs text-emerald-600 mb-1">Điểm Loyalty</div>
                <div className="font-black text-emerald-600 text-lg">{customer.loyaltyPoints}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="flex-1">
          <h1 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            Lịch sử đơn hàng
          </h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-bold mb-2">Bạn chưa có đơn hàng nào</h3>
              <p className="text-gray-500">Hãy tiếp tục mua sắm và các đơn hàng của bạn sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                  <div className="bg-gray-50 p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="font-mono font-bold text-emerald-600 mb-1">#{order.code}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.orderDate).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <div className="text-sm font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 w-fit">
                        {order.status === 0 ? 'Chờ xử lý' : 
                         order.status === 1 ? 'Đã xác nhận' : 
                         order.status === 2 ? 'Đang giao hàng' : 
                         order.status === 3 ? 'Hoàn thành' : 'Đã hủy'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="space-y-4 mb-6">
                      {order.details?.map((item: any) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {item.productImageUrl ? (
                              <img src={item.productImageUrl.startsWith('http') ? item.productImageUrl : `http://localhost:5222${item.productImageUrl}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">📦</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm md:text-base line-clamp-1">{item.productName || 'Sản phẩm'}</h4>
                            <div className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</div>
                          </div>
                          <div className="font-bold text-gray-800 text-sm md:text-base">
                            {item.subTotal.toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{order.customerAddress || 'Nhận tại cửa hàng'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4 flex-shrink-0" />
                          <span>{order.paymentMethod === 1 ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản / Quẹt thẻ'}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Tạm tính</span>
                          <span>{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="flex justify-between text-sm text-emerald-600">
                            <span>Giảm giá</span>
                            <span>-{order.discountAmount.toLocaleString('vi-VN')}₫</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-black pt-2 border-t mt-2">
                          <span>Tổng cộng</span>
                          <span className="text-emerald-600">{order.finalAmount.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
