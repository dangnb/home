import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

const productInclude = {
  tastingNotes: { orderBy: { sortOrder: "asc" as const } },
  addOns: { orderBy: { sortOrder: "asc" as const } },
  reviews: { where: { status: "APPROVED" as const }, orderBy: { createdAt: "desc" as const } },
};

export type MenuProduct = Awaited<ReturnType<typeof getActiveProducts>>[number];

export async function getActiveProducts() {
  return db.product.findMany({
    where: { status: "ACTIVE" },
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getFeaturedProducts() {
  return db.product.findMany({ where: { status: "ACTIVE", badge: "FEATURED" }, include: productInclude, orderBy: { sortOrder: "asc" } });
}

export async function getBestSellingProducts() {
  return db.product.findMany({ where: { status: "ACTIVE", badge: "BEST_SELLER" }, include: productInclude, orderBy: { sortOrder: "asc" } });
}

export async function getNewProducts() {
  return db.product.findMany({ where: { status: "ACTIVE", badge: "NEW" }, include: productInclude, orderBy: { sortOrder: "asc" } });
}

export async function getProductBySlug(slug: string) {
  return db.product.findFirst({ where: { slug, status: "ACTIVE" }, include: productInclude });
}

export async function getRequiredProductBySlug(slug: string) {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return product;
}

export async function getRelatedProducts(slug: string) {
  return db.product.findMany({ where: { status: "ACTIVE", slug: { not: slug } }, include: productInclude, orderBy: { sortOrder: "asc" }, take: 3 });
}
