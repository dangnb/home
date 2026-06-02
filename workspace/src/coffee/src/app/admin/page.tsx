import { AdminShell } from "@/components/AdminShell";
import { getAdminDashboardStats } from "@/features/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const cards = [
    ["Đơn mới", stats.newOrders],
    ["Ứng tuyển mới", stats.pendingApplications],
    ["Review chờ duyệt", stats.pendingReviews],
    ["Sản phẩm active", stats.activeProducts],
    ["Tin đã đăng", stats.publishedNews],
    ["Tin nháp", stats.draftNews],
  ];

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Dashboard</p>
        <h1 className="mt-3 text-4xl font-black text-[#2b160c]">Tổng quan vận hành</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-[2rem] bg-white/75 p-6 shadow-sm">
              <p className="text-4xl font-black text-[#d9863d]">{value}</p>
              <p className="mt-2 font-bold text-[#75543d]">{label}</p>
            </div>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
