import { VoucherForm } from "@/components/admin/voucher-form";

export default function NewVoucherPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo voucher mới</h1>
      <VoucherForm />
    </div>
  );
}
