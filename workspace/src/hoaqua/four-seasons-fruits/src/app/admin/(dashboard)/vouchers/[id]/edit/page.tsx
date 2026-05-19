import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { VoucherForm } from "@/components/admin/voucher-form";

interface EditVoucherPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVoucherPage({ params }: EditVoucherPageProps) {
  const { id } = await params;
  const voucher = await db.voucher.findUnique({ where: { id } });
  if (!voucher) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa voucher: {voucher.code}</h1>
      <VoucherForm initialData={voucher} />
    </div>
  );
}
