"use client";

// Product Comments/Reviews section
// Requires customer login to post

import { useState } from "react";
import { addComment, deleteComment } from "@/actions/comment-actions";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: Date;
  customer: { id: string; name: string; avatar: string | null };
}

interface ProductCommentsProps {
  productId: string;
  comments: Comment[];
  currentCustomerId: string | null;
}

export function ProductComments({ productId, comments, currentCustomerId }: ProductCommentsProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    const result = await addComment(productId, content.trim(), rating);

    if (result.success) {
      toast.success("Đã gửi bình luận!");
      setContent("");
      setRating(5);
      router.refresh();
    } else {
      toast.error(result.error || "Gửi thất bại");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Xóa bình luận này?")) return;
    const result = await deleteComment(commentId);
    if (result.success) {
      toast.success("Đã xóa");
      router.refresh();
    } else {
      toast.error(result.error || "Xóa thất bại");
    }
  };

  const avgRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : "0";

  return (
    <div className="mt-16 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
          Đánh giá ({comments.length})
        </h2>
        {comments.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{avgRating}</span>
            <span className="text-gray-500 text-sm">/ 5</span>
          </div>
        )}
      </div>

      {/* Comment Form */}
      {currentCustomerId ? (
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border">
          <p className="text-sm font-medium text-gray-700 mb-3">Viết đánh giá của bạn</p>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
          </div>

          {/* Comment Input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows={3}
            className="mb-3"
          />

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border text-center">
          <p className="text-gray-600 mb-3">Đăng nhập để viết đánh giá</p>
          <Link href="/auth">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Đăng nhập / Đăng ký
            </Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                    {comment.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{comment.customer.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= comment.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  {currentCustomerId === comment.customer.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-sm mt-3 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
