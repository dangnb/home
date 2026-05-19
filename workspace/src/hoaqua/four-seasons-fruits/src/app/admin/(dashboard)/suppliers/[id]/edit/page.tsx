import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SupplierForm } from "@/components/admin/supplier-form";

interface EditSupplierPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const { id } = await params;
  const supplier = await db.supplier.findUnique({ where: { id } });
  if (!supplier) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa: {supplier.name}</h1>
      <SupplierForm initialData={supplier} />
    </div>
  );
}
