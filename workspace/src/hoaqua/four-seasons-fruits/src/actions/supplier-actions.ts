"use server";

// Server Actions for Supplier CRUD

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface SupplierFormData {
  name: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactName?: string;
  taxCode?: string;
  description?: string;
  logo?: string;
  isActive: boolean;
}

export async function getSuppliers() {
  return db.supplier.findMany({ orderBy: { name: "asc" } });
}

export async function getActiveSuppliers() {
  return db.supplier.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

export async function getSupplierById(id: string) {
  return db.supplier.findUnique({ where: { id } });
}

export async function createSupplier(data: SupplierFormData) {
  try {
    if (data.code) {
      const existing = await db.supplier.findUnique({ where: { code: data.code } });
      if (existing) return { success: false, error: "Mã NCC đã tồn tại" };
    }

    await db.supplier.create({
      data: {
        name: data.name,
        code: data.code || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        contactName: data.contactName || null,
        taxCode: data.taxCode || null,
        description: data.description || null,
        logo: data.logo || null,
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    console.error("Failed to create supplier:", error);
    return { success: false, error: "Tạo NCC thất bại" };
  }
}

export async function updateSupplier(id: string, data: SupplierFormData) {
  try {
    if (data.code) {
      const existing = await db.supplier.findFirst({ where: { code: data.code, NOT: { id } } });
      if (existing) return { success: false, error: "Mã NCC đã tồn tại" };
    }

    await db.supplier.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        contactName: data.contactName || null,
        taxCode: data.taxCode || null,
        description: data.description || null,
        logo: data.logo || null,
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update supplier:", error);
    return { success: false, error: "Cập nhật thất bại" };
  }
}

export async function deleteSupplier(id: string) {
  try {
    await db.supplier.delete({ where: { id } });
    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete supplier:", error);
    return { success: false, error: "Xóa thất bại" };
  }
}
