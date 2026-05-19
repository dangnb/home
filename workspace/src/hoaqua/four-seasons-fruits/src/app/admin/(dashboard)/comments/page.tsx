// Admin Comments Management - View, moderate, delete comments

import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { AdminDeleteCommentButton } from "./admin-delete-comment-button";

export default async function AdminCommentsPage() {
  const comments = await db.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  });

  // Stats
  const totalComments = comments.length;
  const avgRating = totalComments > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / totalComments).toFixed(1)
    : "0";
  const fiveStars = comments.filter((c) => c.rating === 5).length;
  const oneStars = comments.filter((c) => c.rating <= 2).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
        <p className="text-gray-600 text-sm mt-1">{totalComments} đánh giá từ khách hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Tổng đánh giá</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalComments}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Điểm trung bình</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
            <span className="text-gray-400 text-sm">/5</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">5 sao</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{fiveStars}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">1-2 sao</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{oneStars}</p>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{comment.customer.name}</p>
                    <p className="text-xs text-gray-500">{comment.customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/products/${comment.product.slug}`}
                    className="text-sm text-emerald-600 hover:underline font-medium"
                  >
                    {comment.product.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
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
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-700 max-w-xs truncate">
                    {comment.content}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">
                  <AdminDeleteCommentButton commentId={comment.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {comments.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Chưa có đánh giá nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
