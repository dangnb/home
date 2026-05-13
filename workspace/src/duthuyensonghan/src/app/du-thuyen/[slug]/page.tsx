import { cruiseData } from "@/data/cruises";
import { notFound } from "next/navigation";
import CruiseDetailClient from "./CruiseDetailClient";

export async function generateStaticParams() {
  return Object.keys(cruiseData).map((slug) => ({ slug }));
}

export default async function CruiseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cruise = cruiseData[slug];

  if (!cruise) notFound();

  return <CruiseDetailClient cruise={cruise} />;
}
