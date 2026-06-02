import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/db";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Sản phẩm</p>
        <h1 className="mt-3 text-4xl font-black text-[#2b160c]">Quản lý menu</h1>
        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white/80 shadow-sm">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-[#ead8c5] p-5 font-black text-[#2b160c]">
            <span>Tên món</span><span>Danh mục</span><span>Giá</span><span>Trạng thái</span>
          </div>
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-[#f1dfcc] p-5 text-[#75543d] last:border-b-0">
              <span className="font-black text-[#2b160c]">{product.name}</span>
              <span>{product.category}</span>
              <span>{formatVnd(product.price)}</span>
              <span>{product.status}</span>
            </div>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
