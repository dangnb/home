"use server";

// Server Actions for Product CRUD operations

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";

export interface ProductFormData {
  name: string;
  description?: string;
  content?: string;
  price: number;
  salePrice?: number | null;
  image?: string;
  images?: string;
  stock: number;
  unit: string;
  featured: boolean;
  isOnSale: boolean;
  categoryId: string;
}

/**
 * Get all products with optional filtering
 */
export async function getProducts(params?: {
  search?: string;
  categoryId?: string;
  featured?: boolean;
  isOnSale?: boolean;
  page?: number;
  limit?: number;
}) {
  const {
    search,
    categoryId,
    featured,
    isOnSale,
    page = 1,
    limit = 12,
  } = params || {};

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (featured !== undefined) where.featured = featured;
  if (isOnSale !== undefined) where.isOnSale = isOnSale;

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductFormData) {
  try {
    const slug = slugify(data.name);

    // Check if slug already exists
    const existing = await db.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await db.product.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description || null,
        content: data.content || null,
        price: data.price,
        salePrice: data.salePrice || null,
        image: data.image || null,
        images: data.images || null,
        stock: data.stock,
        unit: data.unit,
        featured: data.featured,
        isOnSale: data.isOnSale,
        categoryId: data.categoryId,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: ProductFormData) {
  try {
    const slug = slugify(data.name);

    // Check if slug already exists for a different product
    const existing = await db.product.findFirst({
      where: { slug, NOT: { id } },
    });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await db.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description || null,
        content: data.content || null,
        price: data.price,
        salePrice: data.salePrice || null,
        image: data.image || null,
        images: data.images || null,
        stock: data.stock,
        unit: data.unit,
        featured: data.featured,
        isOnSale: data.isOnSale,
        categoryId: data.categoryId,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
