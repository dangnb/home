import { getCruises, getCruiseBySlug, type CruiseData, getSettings } from "@/lib/db";
import { notFound } from "next/navigation";
import CruiseDetailClient from "./CruiseDetailClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return (await getCruises()).map(c => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cruise = await getCruiseBySlug(slug);
  if (!cruise) return {};
  return {
    title: `${cruise.name} – Du Thuyền Sông Hàn Đà Nẵng`,
    description: `${cruise.tagline}. Giá từ ${cruise.salePrice}. Đặt vé tại 2Da Tickets.`,
  };
}

export default async function CruiseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cruise = await getCruiseBySlug(slug);
  if (!cruise) notFound();

  // Resolve related cruises with full data on the server
  const allCruises = await getCruises();
  const relatedCruises: CruiseData[] = cruise.relatedSlugs
    .map(s => allCruises.find(c => c.slug === s))
    .filter((c): c is CruiseData => !!c);

  const settings = await getSettings();

  return <CruiseDetailClient cruise={cruise} relatedCruises={relatedCruises} timeSlots={settings.departureSlots} />;
}
