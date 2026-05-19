// Admin Posts Management Page - List all articles

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { DeletePostButton } from "./delete-post-button";

export default async function AdminPostsPage() {
  const posts = await db.post.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const typeLabels: Record<string, string> = {
    about: "Giới thiệu",
    article: "Bài viết",
    page: "Trang",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
          <p className="text-gray-600 text-sm mt-1">
            {posts.length} bài viết
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Viết bài mới
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {post.excerpt || "Chưa có mô tả"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {typeLabels[post.type] || post.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.published ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0">
                      Đã xuất bản
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 border-0">
                      Bản nháp
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </Link>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Chưa có bài viết nào</p>
            <p className="text-sm mt-1">Bắt đầu viết bài giới thiệu về cửa hàng</p>
          </div>
        )}
      </div>
    </div>
  );
}
