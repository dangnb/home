// Import Receipt Detail Page - View receipt with print-friendly layout

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileInput } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã duyệt", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-600" },
};

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ImportReceiptDetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  const receipt = await db.importReceipt.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { name: true, unit: true } } } } },
  });

  if (!receipt) notFound();

  const status = statusConfig[receipt.status] || statusConfig.draft;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/import-receipts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <Badge className={`${status.color} border-0 text-sm px-3 py-1`}>{status.label}</Badge>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileInput className="h-6 w-6" />
                <h1 className="text-2xl font-bold">PHIẾU NHẬP HÀNG</h1>
              </div>
              <p className="text-emerald-100 font-mono text-lg">{receipt.code}</p>
            </div>
            <div className="text-right text-emerald-100 text-sm">
              <p>Ngày tạo: {new Date(receipt.createdAt).toLocaleDateString("vi-VN")}</p>
              {receipt.confirmedAt && (
                <p>Ngày duyệt: {new Date(receipt.confirmedAt).toLocaleDateString("vi-VN")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Nhà cung cấp</p>
              <p className="font-semibold text-gray-900">{receipt.supplier}</p>
            </div>
            {receipt.note && (
              <div>
                <p className="text-gray-500 mb-1">Ghi chú</p>
                <p className="text-gray-700">{receipt.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs uppercase text-gray-500">
                <th className="text-left py-3 font-semibold">STT</th>
                <th className="text-left py-3 font-semibold">Sản phẩm</th>
                <th className="text-center py-3 font-semibold">ĐVT</th>
                <th className="text-center py-3 font-semibold">Số lượng</th>
                <th className="text-right py-3 font-semibold">Đơn giá</th>
                <th className="text-right py-3 font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">{item.product.name}</td>
                  <td className="py-3 text-sm text-center text-gray-600">{item.product.unit}</td>
                  <td className="py-3 text-sm text-center font-medium">{item.quantity}</td>
                  <td className="py-3 text-sm text-right text-gray-600">{formatPrice(item.unitPrice)}</td>
                  <td className="py-3 text-sm text-right font-semibold">{formatPrice(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Tổng: {receipt.items.length} sản phẩm,{" "}
              {receipt.items.reduce((s, i) => s + i.quantity, 0)} đơn vị
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tổng tiền nhập</p>
              <p className="text-2xl font-bold text-emerald-600">{formatPrice(receipt.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="grid grid-cols-3 gap-8 text-center text-sm">
            <div>
              <p className="text-gray-500 mb-8">Người lập phiếu</p>
              <p className="font-medium text-gray-700">{receipt.createdBy || "Admin"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-8">Người giao hàng</p>
              <p className="font-medium text-gray-700">_______________</p>
            </div>
            <div>
              <p className="text-gray-500 mb-8">Thủ kho</p>
              <p className="font-medium text-gray-700">_______________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
