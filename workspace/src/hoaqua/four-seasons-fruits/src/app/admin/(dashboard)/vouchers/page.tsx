// Admin Vouchers Management Page

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Ticket } from "lucide-react";
import Link from "next/link";
import { DeleteVoucherButton } from "./delete-voucher-button";
import { ToggleVoucherButton } from "./toggle-voucher-button";

export default async function AdminVouchersPage() {
  const vouchers = await db.voucher.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { usages: true } } },
  });

  const now = new Date();

  const getStatus = (v: { isActive: boolean; startDate: Date; endDate: Date; usageLimit: number | null; usedCount: number }) => {
    if (!v.isActive) return { label: "Tắt", color: "bg-gray-100 text-gray-600" };
    if (v.usageLimit && v.usedCount >= v.usageLimit) return { label: "Hết lượt", color: "bg-red-100 text-red-600" };
    if (now < v.startDate) return { label: "Sắp tới", color: "bg-blue-100 text-blue-700" };
    if (now > v.endDate) return { label: "Hết hạn", color: "bg-red-100 text-red-600" };
    return { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
          <p className="text-gray-600 text-sm mt-1">{vouchers.length} voucher</p>
        </div>
        <Link href="/admin/vouchers/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo voucher
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã voucher</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Điều kiện</TableHead>
              <TableHead>Đã dùng</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher) => {
              const status = getStatus(voucher);
              return (
                <TableRow key={voucher.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Ticket className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-sm">{voucher.code}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {voucher.description || "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-lg font-bold text-purple-600">
                      {voucher.discountType === "percent"
                        ? `${voucher.discountValue}%`
                        : formatPrice(voucher.discountValue)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="space-y-0.5">
                      {voucher.minOrder && <p>Đơn tối thiểu: {formatPrice(voucher.minOrder)}</p>}
                      {voucher.maxDiscount && <p>Giảm tối đa: {formatPrice(voucher.maxDiscount)}</p>}
                      {!voucher.minOrder && !voucher.maxDiscount && <p>Không giới hạn</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {voucher.usedCount}
                      {voucher.usageLimit ? `/${voucher.usageLimit}` : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <p>{new Date(voucher.startDate).toLocaleDateString("vi-VN")}</p>
                    <p className="text-gray-400">→ {new Date(voucher.endDate).toLocaleDateString("vi-VN")}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ToggleVoucherButton voucherId={voucher.id} isActive={voucher.isActive} />
                      <Link href={`/admin/vouchers/${voucher.id}/edit`}>
                        <Button variant="outline" size="sm">Sửa</Button>
                      </Link>
                      <DeleteVoucherButton voucherId={voucher.id} voucherCode={voucher.code} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {vouchers.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Ticket className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Chưa có voucher nào</p>
            <p className="text-sm mt-1">Tạo voucher để tặng khách hàng</p>
          </div>
        )}
      </div>
    </div>
  );
}
