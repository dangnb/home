"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Không thể đăng nhập");
        return;
      }

      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Không thể kết nối server đăng nhập");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-[2.5rem] bg-[#2b160c] p-7 text-white shadow-2xl shadow-[#2b160c]/20 sm:p-8">
      <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Email admin" type="email" />
      <input value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Mật khẩu" type="password" />
      {error && <p className="rounded-2xl bg-red-500/15 px-4 py-3 font-bold text-red-100">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#f7c873] px-6 py-4 font-black text-[#2b160c] transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
