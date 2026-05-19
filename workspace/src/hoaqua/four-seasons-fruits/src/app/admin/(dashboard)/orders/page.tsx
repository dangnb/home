// Admin Orders Page

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {order.customerPhone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{order.items.length} sản phẩm</p>
                </TableCell>
                <TableCell className="font-semibold text-emerald-600">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }
                  >
                    {order.status === "pending"
                      ? "Chờ xử lý"
                      : order.status === "completed"
                        ? "Hoàn thành"
                        : order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
