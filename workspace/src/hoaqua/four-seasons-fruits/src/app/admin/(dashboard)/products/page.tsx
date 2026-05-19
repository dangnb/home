// Admin Products Management Page
// Lists all products with edit/delete actions

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
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
import { Plus } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "./delete-product-button";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 text-sm mt-1">
            {products.length} sản phẩm
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-lg">
                      🍊
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{formatPrice(product.price)}</p>
                    {product.salePrice && (
                      <p className="text-xs text-red-500">
                        Sale: {formatPrice(product.salePrice)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      product.stock > 0 ? "text-emerald-600" : "text-red-500"
                    }
                  >
                    {product.stock} {product.unit}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {product.featured && (
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                        Nổi bật
                      </Badge>
                    )}
                    {product.isOnSale && (
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        Sale
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
