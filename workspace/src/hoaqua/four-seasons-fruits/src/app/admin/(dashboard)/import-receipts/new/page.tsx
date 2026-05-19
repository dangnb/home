// Create New Import Receipt Page

import { db } from "@/lib/db";
import { ImportReceiptForm } from "./import-receipt-form";

export default async function NewImportReceiptPage() {
  const [products, suppliers] = await Promise.all([
    db.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, unit: true, price: true },
    }),
    db.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo phiếu nhập hàng</h1>
      <ImportReceiptForm products={products} suppliers={suppliers} />
    </div>
  );
}
