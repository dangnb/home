// API route for updating a draft import receipt

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/actions/auth-actions";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, supplier, note, items } = await request.json();

  try {
    const receipt = await db.importReceipt.findUnique({ where: { id } });
    if (!receipt) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    if (receipt.status !== "draft") return NextResponse.json({ error: "Chỉ sửa được phiếu nháp" }, { status: 400 });

    const totalAmount = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0);

    // Delete old items and recreate
    await db.importReceiptItem.deleteMany({ where: { importReceiptId: id } });

    await db.importReceipt.update({
      where: { id },
      data: {
        supplier,
        note,
        totalAmount,
        items: {
          create: items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update import receipt failed:", error);
    return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
  }
}
