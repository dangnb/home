// Edit Promotion Page

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PromotionForm } from "@/components/admin/promotion-form";

interface EditPromotionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPromotionPage({ params }: EditPromotionPageProps) {
  const { id } = await params;

  const [promotion, categories, products] = await Promise.all([
    db.promotion.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!promotion) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sửa: {promotion.name}
      </h1>
      <PromotionForm
        categories={categories}
        products={products}
        initialData={promotion}
      />
    </div>
  );
}
