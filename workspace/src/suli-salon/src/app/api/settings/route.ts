import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    for (const [key, value] of Object.entries(body)) {
      const strValue = typeof value === "string" ? value : JSON.stringify(value);
      await prisma.setting.upsert({
        where: { key },
        create: { key, value: strValue },
        update: { value: strValue },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
