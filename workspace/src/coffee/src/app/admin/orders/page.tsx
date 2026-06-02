import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/db";
import { formatDate, formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Đơn hàng</p>
        <h1 className="mt-3 text-4xl font-black text-[#2b160c]">Theo dõi đơn đặt món</h1>
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2b160c]">{order.code}</h2>
                  <p className="mt-2 font-bold text-[#75543d]">{order.customerName} · {order.customerPhone} · {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#d9863d]">{formatVnd(order.total)}</p>
                  <p className="mt-1 font-bold text-[#75543d]">{order.status} · {order.paymentStatus}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {order.items.map((item) => (
                  <span key={item.id} className="rounded-full bg-[#f7eadb] px-3 py-2 text-sm font-bold text-[#70411f]">{item.productName} × {item.quantity}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
