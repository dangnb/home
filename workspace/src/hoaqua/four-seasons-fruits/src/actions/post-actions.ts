"use server";

// Server Actions for Post/Article CRUD operations

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";

export interface PostFormData {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  published: boolean;
  type: string;
}

/**
 * Get all posts
 */
export async function getPosts(type?: string) {
  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  return db.post.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Get published posts
 */
export async function getPublishedPosts(type?: string) {
  const where: Record<string, unknown> = { published: true };
  if (type) where.type = type;

  return db.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  return db.post.findUnique({ where: { slug } });
}

/**
 * Get a single post by ID
 */
export async function getPostById(id: string) {
  return db.post.findUnique({ where: { id } });
}

/**
 * Create a new post
 */
export async function createPost(data: PostFormData) {
  try {
    const slug = slugify(data.title);
    const existing = await db.post.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await db.post.create({
      data: {
        title: data.title,
        slug: finalSlug,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        published: data.published,
        type: data.type,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/about");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, data: PostFormData) {
  try {
    const slug = slugify(data.title);
    const existing = await db.post.findFirst({
      where: { slug, NOT: { id } },
    });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await db.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: finalSlug,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        published: data.published,
        type: data.type,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/about");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string) {
  try {
    await db.post.delete({ where: { id } });

    revalidatePath("/admin/posts");
    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
