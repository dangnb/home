// Create New Category Page

import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Thêm danh mục mới
      </h1>
      <CategoryForm />
    </div>
  );
}
