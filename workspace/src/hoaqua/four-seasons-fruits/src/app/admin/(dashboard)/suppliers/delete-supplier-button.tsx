"use client";
import { useState } from "react";
import { deleteSupplier } from "@/actions/supplier-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteSupplierButton({ supplierId, supplierName }: { supplierId: string; supplierName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Xóa nhà cung cấp "${supplierName}"?`)) return;
    setIsDeleting(true);
    const result = await deleteSupplier(supplierId);
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
