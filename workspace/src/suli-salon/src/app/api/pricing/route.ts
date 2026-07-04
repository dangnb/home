import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPricing } from "@/lib/db";

export async function GET() {
  const p = await getPricing();
  return NextResponse.json(p);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  try {
    await prisma.pricing.upsert({
      where: { key: "regular" },
      create: { key: "regular", note: body.regularNote ?? "", prices: JSON.stringify(body.regularPrices ?? []) },
      update: { note: body.regularNote ?? "", prices: JSON.stringify(body.regularPrices ?? []) },
    });
    await prisma.pricing.upsert({
      where: { key: "dinner" },
      create: { key: "dinner", note: body.dinnerNote ?? "", prices: JSON.stringify(body.dinnerPrices ?? []) },
      update: { note: body.dinnerNote ?? "", prices: JSON.stringify(body.dinnerPrices ?? []) },
    });
    await prisma.pricing.upsert({
      where: { key: "fireworks" },
      create: { key: "fireworks", note: body.fireworksNote ?? "", prices: JSON.stringify(body.fireworksPrices ?? []) },
      update: { note: body.fireworksNote ?? "", prices: JSON.stringify(body.fireworksPrices ?? []) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
