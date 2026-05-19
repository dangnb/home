"use server";

// Server Actions for Voucher CRUD and validation

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface VoucherFormData {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrder?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

/**
 * Get all vouchers
 */
export async function getVouchers() {
  return db.voucher.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { usages: true } } },
  });
}

/**
 * Get voucher by ID
 */
export async function getVoucherById(id: string) {
  return db.voucher.findUnique({
    where: { id },
    include: { usages: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
}

/**
 * Create a new voucher
 */
export async function createVoucher(data: VoucherFormData) {
  try {
    // Check if code already exists
    const existing = await db.voucher.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) {
      return { success: false, error: "Mã voucher đã tồn tại" };
    }

    await db.voucher.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description || null,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrder: data.minOrder || null,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/vouchers");
    return { success: true };
  } catch (error) {
    console.error("Failed to create voucher:", error);
    return { success: false, error: "Tạo voucher thất bại" };
  }
}

/**
 * Update a voucher
 */
export async function updateVoucher(id: string, data: VoucherFormData) {
  try {
    const existing = await db.voucher.findFirst({
      where: { code: data.code.toUpperCase(), NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Mã voucher đã tồn tại" };
    }

    await db.voucher.update({
      where: { id },
      data: {
        code: data.code.toUpperCase(),
        description: data.description || null,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrder: data.minOrder || null,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/vouchers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update voucher:", error);
    return { success: false, error: "Cập nhật thất bại" };
  }
}

/**
 * Delete a voucher
 */
export async function deleteVoucher(id: string) {
  try {
    await db.voucherUsage.deleteMany({ where: { voucherId: id } });
    await db.voucher.delete({ where: { id } });
    revalidatePath("/admin/vouchers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete voucher:", error);
    return { success: false, error: "Xóa thất bại" };
  }
}

/**
 * Toggle voucher active status
 */
export async function toggleVoucherStatus(id: string) {
  try {
    const voucher = await db.voucher.findUnique({ where: { id } });
    if (!voucher) return { success: false, error: "Không tìm thấy" };

    await db.voucher.update({
      where: { id },
      data: { isActive: !voucher.isActive },
    });

    revalidatePath("/admin/vouchers");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle voucher:", error);
    return { success: false, error: "Thao tác thất bại" };
  }
}

/**
 * Apply voucher code at checkout
 * Validates: exists, active, date range, usage limits
 */
export async function applyVoucher(code: string, email: string, orderTotal: number) {
  try {
    const now = new Date();
    const voucher = await db.voucher.findUnique({
      where: { code: code.toUpperCase() },
      include: { usages: true },
    });

    if (!voucher) {
      return { success: false, error: "Mã voucher không tồn tại" };
    }

    if (!voucher.isActive) {
      return { success: false, error: "Mã voucher đã bị vô hiệu hóa" };
    }

    if (now < voucher.startDate) {
      return { success: false, error: "Mã voucher chưa có hiệu lực" };
    }

    if (now > voucher.endDate) {
      return { success: false, error: "Mã voucher đã hết hạn" };
    }

    // Check usage limit
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { success: false, error: "Mã voucher đã hết lượt sử dụng" };
    }

    // Check per-user limit
    const userUsages = voucher.usages.filter((u) => u.email === email);
    if (userUsages.length >= voucher.perUserLimit) {
      return { success: false, error: "Bạn đã sử dụng mã này rồi" };
    }

    // Check min order
    if (voucher.minOrder && orderTotal < voucher.minOrder) {
      return {
        success: false,
        error: `Đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN").format(voucher.minOrder)}đ`,
      };
    }

    // Calculate discount
    let discountAmount: number;
    if (voucher.discountType === "percent") {
      discountAmount = Math.round(orderTotal * (voucher.discountValue / 100));
      if (voucher.maxDiscount) {
        discountAmount = Math.min(discountAmount, voucher.maxDiscount);
      }
    } else {
      // Fixed amount
      discountAmount = voucher.discountValue;
    }

    // Don't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return {
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        discountAmount,
        maxDiscount: voucher.maxDiscount,
        minOrder: voucher.minOrder,
      },
    };
  } catch (error) {
    console.error("Failed to apply voucher:", error);
    return { success: false, error: "Lỗi hệ thống" };
  }
}

/**
 * Record voucher usage after successful order
 */
export async function recordVoucherUsage(voucherId: string, email: string, orderId: string, discount: number) {
  try {
    await db.$transaction([
      db.voucherUsage.create({
        data: { voucherId, email, orderId, discount },
      }),
      db.voucher.update({
        where: { id: voucherId },
        data: { usedCount: { increment: 1 } },
      }),
    ]);
  } catch (error) {
    console.error("Failed to record voucher usage:", error);
  }
}
