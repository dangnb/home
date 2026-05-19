"use client";

import { useState } from "react";
import { deletePost } from "@/actions/post-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${postTitle}"?`)) return;

    setIsDeleting(true);
    const result = await deletePost(postId);

    if (result.success) {
      toast.success("Đã xóa bài viết");
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
