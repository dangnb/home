// Admin Import Receipts - List all phiếu nhập hàng

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, FileInput } from "lucide-react";
import Link from "next/link";
import { ImportReceiptActions } from "./import-receipt-actions-buttons";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã duyệt", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-600" },
};

export default async function AdminImportReceiptsPage() {
  const receipts = await db.importReceipt.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true } } } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phiếu nhập hàng</h1>
          <p className="text-gray-600 text-sm mt-1">{receipts.length} phiếu</p>
        </div>
        <Link href="/admin/import-receipts/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu nhập
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => {
              const status = statusConfig[receipt.status] || statusConfig.draft;
              return (
                <TableRow key={receipt.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileInput className="h-4 w-4 text-emerald-600" />
                      <span className="font-mono font-medium text-sm">{receipt.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{receipt.supplier}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {receipt.items.slice(0, 2).map((item, i) => (
                        <p key={i} className="truncate max-w-[150px]">{item.product.name}</p>
                      ))}
                      {receipt.items.length > 2 && (
                        <p className="text-xs text-gray-400">+{receipt.items.length - 2} SP khác</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    {formatPrice(receipt.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(receipt.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <ImportReceiptActions
                      receiptId={receipt.id}
                      status={receipt.status}
                      code={receipt.code}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {receipts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <FileInput className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Chưa có phiếu nhập nào</p>
            <p className="text-sm mt-1">Tạo phiếu nhập để quản lý hàng hóa nhập kho</p>
          </div>
        )}
      </div>
    </div>
  );
}
