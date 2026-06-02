"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-full border border-white/20 px-4 py-2 text-sm font-black text-white transition hover:bg-white hover:text-[#2b160c]"
    >
      Đăng xuất
    </button>
  );
}
