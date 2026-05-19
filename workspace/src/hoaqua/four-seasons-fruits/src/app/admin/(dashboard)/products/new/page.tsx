// Create New Product Page

import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Thêm sản phẩm mới
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
