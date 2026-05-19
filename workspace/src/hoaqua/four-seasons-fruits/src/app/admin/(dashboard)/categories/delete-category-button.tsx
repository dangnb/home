"use client";

// Delete Category Button with confirmation

import { useState } from "react";
import { deleteCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (productCount > 0) {
      toast.error(
        `Không thể xóa "${categoryName}" vì còn ${productCount} sản phẩm`
      );
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}"?`)) return;

    setIsDeleting(true);
    const result = await deleteCategory(categoryId);

    if (result.success) {
      toast.success("Đã xóa danh mục");
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
