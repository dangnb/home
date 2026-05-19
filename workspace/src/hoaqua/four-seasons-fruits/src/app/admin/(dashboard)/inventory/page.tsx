// Admin Inventory Page - Stock overview + history + manual adjustment

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { AdjustStockButton } from "./adjust-stock-button";

export default async function AdminInventoryPage() {
  const [products, stockHistory] = await Promise.all([
    db.product.findMany({
      include: { category: true },
      orderBy: { stock: "asc" },
    }),
    db.stockHistory.findMany({
      include: { product: { select: { name: true, unit: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
    in: { label: "Nhập kho", color: "text-emerald-600 bg-emerald-50", icon: "+" },
    out: { label: "Xuất kho", color: "text-red-600 bg-red-50", icon: "-" },
    return: { label: "Trả hàng", color: "text-orange-600 bg-orange-50", icon: "+" },
    adjust: { label: "Điều chỉnh", color: "text-blue-600 bg-blue-50", icon: "~" },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý kho</h1>
        <p className="text-gray-600 text-sm mt-1">Tồn kho, nhập/xuất, lịch sử</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng SP</CardTitle>
            <Package className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sắp hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStock.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hết hàng</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStock.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Giá trị kho</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-sm">Tồn kho sản phẩm</h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 10
                              ? "text-yellow-600"
                              : "text-emerald-600"
                        }`}>
                          {product.stock}
                        </span>
                        <span className="text-xs text-gray-400">{product.unit}</span>
                        {product.stock === 0 && (
                          <Badge className="bg-red-100 text-red-600 border-0 text-[10px]">Hết</Badge>
                        )}
                        {product.stock > 0 && product.stock <= 10 && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-0 text-[10px]">Sắp hết</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AdjustStockButton
                        productId={product.id}
                        productName={product.name}
                        currentStock={product.stock}
                        unit={product.unit}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Stock History */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-sm">Lịch sử kho (gần đây)</h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {stockHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Chưa có lịch sử</p>
              </div>
            ) : (
              <div className="divide-y">
                {stockHistory.map((entry) => {
                  const config = typeConfig[entry.type] || typeConfig.adjust;
                  return (
                    <div key={entry.id} className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {entry.product.name}
                        </p>
                        <p className="text-xs text-gray-500">{entry.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${
                          entry.type === "out" ? "text-red-600" : "text-emerald-600"
                        }`}>
                          {entry.type === "out" ? "-" : "+"}{entry.quantity} {entry.product.unit}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Còn: {entry.stockAfter}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
