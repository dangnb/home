// Edit Product Page

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sửa sản phẩm: {product.name}
      </h1>
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
