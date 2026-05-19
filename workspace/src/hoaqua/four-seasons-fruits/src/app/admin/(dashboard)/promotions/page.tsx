// Admin Promotions Management Page

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
import { Plus, Percent } from "lucide-react";
import Link from "next/link";
import { DeletePromotionButton } from "./delete-promotion-button";
import { ToggleStatusButton } from "./toggle-status-button";

export default async function AdminPromotionsPage() {
  const promotions = await db.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  const getStatus = (promo: { isActive: boolean; startDate: Date; endDate: Date }) => {
    if (!promo.isActive) return { label: "Tắt", color: "bg-gray-100 text-gray-600" };
    if (now < promo.startDate) return { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-700" };
    if (now > promo.endDate) return { label: "Hết hạn", color: "bg-red-100 text-red-600" };
    return { label: "Đang chạy", color: "bg-emerald-100 text-emerald-700" };
  };

  const typeLabels: Record<string, string> = {
    product: "Theo sản phẩm",
    category: "Theo danh mục",
    all: "Toàn bộ",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chương trình khuyến mại</h1>
          <p className="text-gray-600 text-sm mt-1">
            {promotions.length} chương trình
          </p>
        </div>
        <Link href="/admin/promotions/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo khuyến mại
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên chương trình</TableHead>
              <TableHead>Chiết khấu</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promo) => {
              const status = getStatus(promo);
              return (
                <TableRow key={promo.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Percent className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{promo.name}</p>
                        {promo.code && (
                          <p className="text-xs text-gray-500 font-mono">
                            Mã: {promo.code}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-lg font-bold text-orange-600">
                      {promo.discount}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {typeLabels[promo.type] || promo.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>
                      <p>{new Date(promo.startDate).toLocaleDateString("vi-VN")}</p>
                      <p className="text-gray-400">→ {new Date(promo.endDate).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} border-0`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ToggleStatusButton
                        promotionId={promo.id}
                        isActive={promo.isActive}
                      />
                      <Link href={`/admin/promotions/${promo.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Sửa
                        </Button>
                      </Link>
                      <DeletePromotionButton
                        promotionId={promo.id}
                        promotionName={promo.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {promotions.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Percent className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Chưa có chương trình khuyến mại</p>
            <p className="text-sm mt-1">Tạo chương trình đầu tiên để thu hút khách hàng</p>
          </div>
        )}
      </div>
    </div>
  );
}
