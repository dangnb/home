// Edit Import Receipt Page (only draft receipts can be edited)

import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { EditImportReceiptForm } from "./edit-import-receipt-form";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditImportReceiptPage({ params }: EditPageProps) {
  const { id } = await params;

  const receipt = await db.importReceipt.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { id: true, name: true, unit: true, price: true } } } } },
  });

  if (!receipt) notFound();
  if (receipt.status !== "draft") redirect("/admin/import-receipts");

  const [products, suppliers] = await Promise.all([
    db.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, unit: true, price: true } }),
    db.supplier.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa phiếu: {receipt.code}</h1>
      <EditImportReceiptForm
        receipt={receipt}
        products={products}
        suppliers={suppliers}
      />
    </div>
  );
}
