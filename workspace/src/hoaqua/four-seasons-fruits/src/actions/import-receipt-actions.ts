"use server";

// Server Actions for Import Receipt (Phiếu nhập hàng)

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ImportReceiptItemData {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface ImportReceiptFormData {
  supplier: string;
  note?: string;
  items: ImportReceiptItemData[];
}

/**
 * Generate receipt code: PN-YYYYMMDD-XXX
 */
async function generateCode(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `PN-${dateStr}`;

  const count = await db.importReceipt.count({
    where: { code: { startsWith: prefix } },
  });

  const seq = String(count + 1).padStart(3, "0");
  return `${prefix}-${seq}`;
}

/**
 * Get all import receipts
 */
export async function getImportReceipts() {
  return db.importReceipt.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true, unit: true } } } } },
  });
}

/**
 * Get a single import receipt by ID
 */
export async function getImportReceiptById(id: string) {
  return db.importReceipt.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { id: true, name: true, unit: true, stock: true } } } } },
  });
}

/**
 * Create a new import receipt (draft)
 */
export async function createImportReceipt(data: ImportReceiptFormData) {
  try {
    const code = await generateCode();
    const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    await db.importReceipt.create({
      data: {
        code,
        supplier: data.supplier,
        note: data.note || null,
        totalAmount,
        status: "draft",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
    });

    revalidatePath("/admin/import-receipts");
    return { success: true };
  } catch (error) {
    console.error("Failed to create import receipt:", error);
    return { success: false, error: "Tạo phiếu nhập thất bại" };
  }
}

/**
 * Confirm import receipt - adds stock to products
 */
export async function confirmImportReceipt(id: string) {
  try {
    const receipt = await db.importReceipt.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!receipt) return { success: false, error: "Phiếu không tồn tại" };
    if (receipt.status !== "draft") return { success: false, error: "Phiếu đã được xử lý" };

    // Add stock for each item
    for (const item of receipt.items) {
      const newStock = item.product.stock + item.quantity;

      await db.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      // Record stock history
      await db.stockHistory.create({
        data: {
          productId: item.productId,
          type: "in",
          quantity: item.quantity,
          reason: `Phiếu nhập ${receipt.code}`,
          stockAfter: newStock,
        },
      });
    }

    // Update receipt status
    await db.importReceipt.update({
      where: { id },
      data: { status: "confirmed", confirmedAt: new Date() },
    });

    revalidatePath("/admin/import-receipts");
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error("Failed to confirm import receipt:", error);
    return { success: false, error: "Duyệt phiếu thất bại" };
  }
}

/**
 * Cancel an import receipt
 */
export async function cancelImportReceipt(id: string) {
  try {
    const receipt = await db.importReceipt.findUnique({ where: { id } });
    if (!receipt) return { success: false, error: "Phiếu không tồn tại" };
    if (receipt.status !== "draft") return { success: false, error: "Chỉ hủy được phiếu nháp" };

    await db.importReceipt.update({
      where: { id },
      data: { status: "cancelled" },
    });

    revalidatePath("/admin/import-receipts");
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel import receipt:", error);
    return { success: false, error: "Hủy phiếu thất bại" };
  }
}

/**
 * Delete a draft import receipt
 */
export async function deleteImportReceipt(id: string) {
  try {
    const receipt = await db.importReceipt.findUnique({ where: { id } });
    if (!receipt) return { success: false, error: "Không tìm thấy" };
    if (receipt.status === "confirmed") return { success: false, error: "Không thể xóa phiếu đã duyệt" };

    await db.importReceiptItem.deleteMany({ where: { importReceiptId: id } });
    await db.importReceipt.delete({ where: { id } });

    revalidatePath("/admin/import-receipts");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete import receipt:", error);
    return { success: false, error: "Xóa thất bại" };
  }
}
