import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCustomerById, saveCustomer, deleteCustomer } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  try {
    const customer = await getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ error: "Không tìm thấy khách hàng" }, { status: 404 });
    }

    // Fetch related appointments based on phone
    let appointments: unknown[] = [];
    try {
      const cleanPhone = customer.phone.replace(/\D/g, "");
      const allAppointments = await prisma.appointment.findMany({
        orderBy: { createdAt: "desc" },
      });
      appointments = allAppointments.filter(
        (a) => a.phone.replace(/\D/g, "") === cleanPhone
      );
    } catch (err) {
      console.warn("Unable to fetch related appointments for customer:", err);
    }

    return NextResponse.json({ customer, appointments });
  } catch (error) {
    console.error("Customer GET failed:", error);
    return NextResponse.json({ error: "Lỗi tải thông tin khách hàng" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  try {
    const body = await req.json();
    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Họ tên khách hàng là bắt buộc" }, { status: 400 });
    }
    if (typeof body.phone !== "string" || !body.phone.trim()) {
      return NextResponse.json({ error: "Số điện thoại là bắt buộc" }, { status: 400 });
    }

    const updated = await saveCustomer({
      id,
      name: body.name.trim().slice(0, 100),
      phone: body.phone.trim().slice(0, 30),
      email: typeof body.email === "string" ? body.email.trim().slice(0, 120) : "",
      birthday: typeof body.birthday === "string" ? body.birthday.trim().slice(0, 20) : "",
      gender: body.gender === "male" || body.gender === "other" ? body.gender : "female",
      tier: ["standard", "silver", "gold", "diamond"].includes(body.tier) ? body.tier : "standard",
      notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : "",
      tags: Array.isArray(body.tags) ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean) : [],
      totalSpent: typeof body.totalSpent === "number" ? body.totalSpent : undefined,
      visitCount: typeof body.visitCount === "number" ? body.visitCount : undefined,
      lastVisit: typeof body.lastVisit === "string" ? body.lastVisit : undefined,
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("Customer PUT failed:", error);
    return NextResponse.json({ error: "Không thể cập nhật thông tin khách hàng" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  try {
    const success = await deleteCustomer(id);
    if (!success) {
      return NextResponse.json({ error: "Không tìm thấy khách hàng để xóa" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer DELETE failed:", error);
    return NextResponse.json({ error: "Lỗi xóa khách hàng" }, { status: 500 });
  }
}
