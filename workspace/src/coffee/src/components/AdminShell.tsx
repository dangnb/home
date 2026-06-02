import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { requireAdmin } from "@/lib/auth";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/news", label: "Tin tức" },
  { href: "/admin/recruitment", label: "Tuyển dụng" },
  { href: "/admin/reviews", label: "Reviews" },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#2b160c] text-white shadow-xl shadow-[#2b160c]/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-lg font-black">Mộc Coffee Admin</p>
            <p className="text-sm text-[#e6cfb7]">{admin.email}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-bold text-[#e6cfb7] transition hover:bg-white hover:text-[#2b160c]">
                {item.label}
              </Link>
            ))}
            <AdminLogoutButton />
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
