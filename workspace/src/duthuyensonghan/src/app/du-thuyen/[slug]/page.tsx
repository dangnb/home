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

  const numPrice = parseInt(cruise.salePrice.replace(/\D/g, "")) || 0;

  // JSON-LD Product Schema for SEO Rich Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": cruise.name,
    "image": [
      cruise.mainImage,
      ...cruise.gallery
    ],
    "description": cruise.tagline,
    "sku": cruise.slug,
    "brand": {
      "@type": "Brand",
      "name": "Du Thuyền Sông Hàn"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://duthuyensonghan.vn/du-thuyen/${cruise.slug}`,
      "priceCurrency": "VND",
      "price": numPrice,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": settings.siteName
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ((Math.random() * (5.0 - 4.7)) + 4.7).toFixed(1), // Auto gen high 4.x rating
      "reviewCount": Math.floor(Math.random() * (500 - 100) + 100)
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CruiseDetailClient cruise={cruise} relatedCruises={relatedCruises} timeSlots={settings.departureSlots} />
    </>
  );
}
