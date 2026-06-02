import { Suspense } from "react";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-16 sm:px-8">
      <section className="w-full">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Admin</p>
        <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.04em] text-[#2b160c]">Đăng nhập quản trị Mộc Coffee.</h1>
        <Suspense fallback={<p className="mt-8 font-bold text-[#75543d]">Đang tải form...</p>}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </main>
  );
}
