import Link from "next/link";
import { CartHeaderButton } from "@/components/CartHeaderButton";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Về chúng mình" },
  { href: "/products", label: "Thực đơn" },
  { href: "/news", label: "Tin tức" },
  { href: "/recruitment", label: "Tuyển dụng" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-[#fff8ef]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#3a2114] text-lg font-black text-[#f7c873] shadow-lg shadow-[#8a4f25]/20">M</span>
          <span>
            <span className="block text-lg font-black tracking-tight text-[#2b160c]">Mộc Coffee</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-[#a66a34] sm:block">Modern brew bar</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/55 p-1 shadow-sm lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-bold text-[#5d3a24] transition hover:bg-[#3a2114] hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/products" className="rounded-full bg-[#d9863d] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#d9863d]/25 transition hover:-translate-y-0.5 hover:bg-[#bd6f2d]">
            Xem menu
          </Link>
          <CartHeaderButton />
        </div>
      </div>
    </header>
  );
}
