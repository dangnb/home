import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const cats = await prisma.category.findMany();
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    const cat = await prisma.category.create({
      data: {
        id: body.id,
        label: body.label,
        slug: body.slug,
        description: body.description ?? "",
      },
    });
    return NextResponse.json({ success: true, category: cat });
  } catch (error) {
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
