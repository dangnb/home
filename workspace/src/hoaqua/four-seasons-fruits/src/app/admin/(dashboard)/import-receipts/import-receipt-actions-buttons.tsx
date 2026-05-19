"use client";

import { useState } from "react";
import { confirmImportReceipt, cancelImportReceipt, deleteImportReceipt } from "@/actions/import-receipt-actions";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2, Eye, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ImportReceiptActions({ receiptId, status, code }: { receiptId: string; status: string; code: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!confirm(`Duyệt phiếu "${code}"? Tồn kho sẽ được cộng thêm.`)) return;
    setIsLoading(true);
    const result = await confirmImportReceipt(receiptId);
    if (result.success) { toast.success("Đã duyệt phiếu nhập - Tồn kho đã cập nhật"); router.refresh(); }
    else toast.error(result.error || "Thất bại");
    setIsLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm(`Hủy phiếu "${code}"?`)) return;
    setIsLoading(true);
    const result = await cancelImportReceipt(receiptId);
    if (result.success) { toast.success("Đã hủy phiếu"); router.refresh(); }
    else toast.error(result.error || "Thất bại");
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Xóa phiếu "${code}"?`)) return;
    setIsLoading(true);
    const result = await deleteImportReceipt(receiptId);
    if (result.success) { toast.success("Đã xóa"); router.refresh(); }
    else toast.error(result.error || "Thất bại");
    setIsLoading(false);
  };

  return (
    <div className="flex gap-1 justify-end">
      <Link href={`/admin/import-receipts/${receiptId}`}>
        <Button variant="ghost" size="sm" title="Xem chi tiết">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>

      {status === "draft" && (
        <>
          <Link href={`/admin/import-receipts/${receiptId}/edit`}>
            <Button variant="ghost" size="sm" title="Sửa" className="text-gray-600 hover:bg-gray-50">
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleConfirm} disabled={isLoading} className="text-emerald-600 hover:bg-emerald-50" title="Duyệt">
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isLoading} className="text-orange-600 hover:bg-orange-50" title="Hủy">
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading} className="text-red-500 hover:bg-red-50" title="Xóa">
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
