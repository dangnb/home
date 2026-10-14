import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { appointmentStatusSchema, parseJsonBody } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await parseJsonBody(req);
  const result = appointmentStatusSchema.safeParse((body as { status?: unknown } | undefined)?.status);
  if (!result.success) return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: result.data },
    });
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("Booking update failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking deletion failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
