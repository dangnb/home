"use client";

// Delete Product Button with confirmation

import { useState } from "react";
import { deleteProduct } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa "${productName}"?`)) return;

    setIsDeleting(true);
    const result = await deleteProduct(productId);

    if (result.success) {
      toast.success("Đã xóa sản phẩm");
      router.refresh();
    } else {
      toast.error(result.error || "Xóa thất bại");
    }

    setIsDeleting(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
