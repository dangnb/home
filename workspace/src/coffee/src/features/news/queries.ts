import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export async function getPublishedNewsPosts() {
  return db.newsPost.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getLatestNewsPosts(take = 3) {
  return db.newsPost.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getPublishedNewsPostBySlug(slug: string) {
  const post = await db.newsPost.findFirst({ where: { slug, status: "PUBLISHED" } });

  if (!post) {
    notFound();
  }

  return post;
}
