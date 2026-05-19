// Edit Category Page

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await db.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sửa danh mục: {category.name}
      </h1>
      <CategoryForm initialData={category} />
    </div>
  );
}
