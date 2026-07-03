import { getPricing, getPosts, getSettings } from "@/lib/db";
import PhaoHoaClient from "./PhaoHoaClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pháo Hoa DIFF Đà Nẵng 2026 – Đặt Vé Du Thuyền | 2Da Tickets",
  description: "Xem pháo hoa quốc tế DIFF Đà Nẵng 2026 trên du thuyền sông Hàn. Đặt vé sớm để nhận ưu đãi tốt nhất.",
};

export default async function PhaoHoaPage() {
  const pricing = await getPricing();
  const recentPosts = (await getPosts())
    .filter(p => p.status === "published")
    .slice(0, 5);
  const s = await getSettings();

  return (
    <PhaoHoaClient
      fireworksPrices={pricing.fireworksPrices}
      fireworksNote={pricing.fireworksNote}
      recentPosts={recentPosts}
      hotline={s.hotline}
      zalo={s.zalo}
    />
  );
}
