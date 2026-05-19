"use server";

// Server Actions for Category CRUD operations

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: string;
}

/**
 * Get all categories
 */
export async function getCategories() {
  return db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryFormData) {
  try {
    const slug = slugify(data.name);

    // Check if slug already exists
    const existing = await db.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await db.category.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description || null,
        image: data.image || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, data: CategoryFormData) {
  try {
    const slug = slugify(data.name);

    // Check if slug already exists for a different category
    const existing = await db.category.findFirst({
      where: { slug, NOT: { id } },
    });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description || null,
        image: data.image || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const category = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (category && category._count.products > 0) {
      return {
        success: false,
        error: "Cannot delete category with existing products",
      };
    }

    await db.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
