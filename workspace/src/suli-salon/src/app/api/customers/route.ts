import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCustomers, saveCustomer } from "@/lib/db";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();
    const tier = searchParams.get("tier");
    const tag = searchParams.get("tag");

    let customers = await getCustomers();

    if (tier && tier !== "all") {
      customers = customers.filter((c) => c.tier === tier);
    }

    if (tag && tag !== "all") {
      customers = customers.filter((c) => c.tags?.some((t) => t.toLowerCase().includes(tag.toLowerCase())));
    }

    if (q) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.notes && c.notes.toLowerCase().includes(q)) ||
          c.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Customers GET failed:", error);
    return NextResponse.json({ error: "Không thể tải danh sách khách hàng" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Họ tên khách hàng là bắt buộc" }, { status: 400 });
    }
    if (typeof body.phone !== "string" || !body.phone.trim()) {
      return NextResponse.json({ error: "Số điện thoại là bắt buộc" }, { status: 400 });
    }

    const customer = await saveCustomer({
      name: body.name.trim().slice(0, 100),
      phone: body.phone.trim().slice(0, 30),
      email: typeof body.email === "string" ? body.email.trim().slice(0, 120) : "",
      birthday: typeof body.birthday === "string" ? body.birthday.trim().slice(0, 20) : "",
      gender: body.gender === "male" || body.gender === "other" ? body.gender : "female",
      tier: ["standard", "silver", "gold", "diamond"].includes(body.tier) ? body.tier : "standard",
      notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : "",
      tags: Array.isArray(body.tags) ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean) : [],
      totalSpent: Number.isInteger(body.totalSpent) ? body.totalSpent : 0,
      visitCount: Number.isInteger(body.visitCount) ? body.visitCount : 0,
      lastVisit: typeof body.lastVisit === "string" ? body.lastVisit : undefined,
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Customer POST failed:", error);
    return NextResponse.json({ error: "Không thể lưu thông tin khách hàng" }, { status: 500 });
  }
}
