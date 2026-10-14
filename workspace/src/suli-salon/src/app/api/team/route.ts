import { NextRequest, NextResponse } from "next/server";
import { getTeamMembers, createTeamMember, deleteTeamMember } from "@/lib/db";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function teamPayload(data: Record<string, unknown>) {
  return {
    name: typeof data.name === "string" ? data.name.trim().slice(0, 100) : "",
    role: typeof data.role === "string" ? data.role.trim().slice(0, 100) : "",
    image: typeof data.image === "string" ? data.image.slice(0, 2_000) : "",
    bio: typeof data.bio === "string" ? data.bio.slice(0, 1_000) : "",
    order: Number.isInteger(data.order) ? data.order as number : 0,
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  return NextResponse.json(await getTeamMembers());
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const data = teamPayload(await req.json());
    if (!data.name || !data.role) return NextResponse.json({ error: "Tên và vai trò là bắt buộc" }, { status: 400 });

    const item = await createTeamMember(data);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Team member creation failed", error);
    return NextResponse.json({ error: "Không thể thêm thành viên" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const data = teamPayload(await req.json());
    if (!data.name || !data.role) return NextResponse.json({ error: "Tên và vai trò là bắt buộc" }, { status: 400 });

    await prisma.teamMember.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team member update failed", error);
    return NextResponse.json({ error: "Không thể cập nhật thành viên" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    await deleteTeamMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team member deletion failed", error);
    return NextResponse.json({ error: "Không thể xóa thành viên" }, { status: 500 });
  }
}
