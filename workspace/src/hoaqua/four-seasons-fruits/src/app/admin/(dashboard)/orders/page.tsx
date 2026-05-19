// Admin Orders Page with status management

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { OrderStatusButtons } from "./order-status-buttons";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-700" },
  returned: { label: "Trả hàng", color: "bg-orange-100 text-orange-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-600" },
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 text-sm mt-1">{orders.length} đơn hàng</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items.slice(0, 2).map((item) => (
                        <p key={item.id} className="text-gray-600 truncate max-w-[150px]">
                          {item.product.name} x{item.quantity}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-gray-400 text-xs">+{order.items.length - 2} sản phẩm khác</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} border-0`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderStatusButtons orderId={order.id} currentStatus={order.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p>Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
