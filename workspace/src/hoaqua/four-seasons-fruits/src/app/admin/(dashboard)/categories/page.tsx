// Admin Categories Management Page

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DeleteCategoryButton } from "./delete-category-button";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 text-sm mt-1">
            {categories.length} danh mục
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm danh mục
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Số sản phẩm</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {category.slug}
                </TableCell>
                <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                  {category.description || "—"}
                </TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </Link>
                    <DeleteCategoryButton
                      categoryId={category.id}
                      categoryName={category.name}
                      productCount={category._count.products}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có danh mục nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
