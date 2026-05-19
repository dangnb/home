"use client";
import { useState } from "react";
import { deleteVoucher } from "@/actions/voucher-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteVoucherButton({ voucherId, voucherCode }: { voucherId: string; voucherCode: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Xóa voucher "${voucherCode}"? Lịch sử sử dụng cũng sẽ bị xóa.`)) return;
    setIsDeleting(true);
    const result = await deleteVoucher(voucherId);
    if (result.success) { toast.success("Đã xóa"); router.refresh(); }
    else toast.error(result.error || "Xóa thất bại");
    setIsDeleting(false);
  };

  return (
    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
