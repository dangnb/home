import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeamMembers, createTeamMember, deleteTeamMember } from "@/lib/db";
import prisma from "@/lib/prisma";

export async function GET() {
  const items = await getTeamMembers();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  try {
    const item = await createTeamMember(data);
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const data = await req.json();
  try {
    await prisma.teamMember.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    await deleteTeamMember(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
