"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AdminDeleteCommentButton({ commentId }: { commentId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Xóa đánh giá này?")) return;
    setIsDeleting(true);

    // Admin delete - direct DB call via server action
    const res = await fetch("/api/admin/delete-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });

    if (res.ok) {
      toast.success("Đã xóa đánh giá");
      router.refresh();
    } else {
      toast.error("Xóa thất bại");
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
