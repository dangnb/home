// Create New Promotion Page

import { db } from "@/lib/db";
import { PromotionForm } from "@/components/admin/promotion-form";

export default async function NewPromotionPage() {
  const [categories, products] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tạo chương trình khuyến mại
      </h1>
      <PromotionForm categories={categories} products={products} />
    </div>
  );
}
