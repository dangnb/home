import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware-auth";

// GET /api/config - Get all site configs
export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const configMap: Record<string, string> = {};
    configs.forEach((c) => {
      configMap[c.key] = c.value;
    });
    return NextResponse.json({ config: configMap });
  } catch (error) {
    console.error("Get config error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/config - Update site configs (auth required)
export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { configs } = body as { configs: { key: string; value: string; description?: string }[] };

    if (!configs || !Array.isArray(configs)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const results = await Promise.all(
      configs.map((config) =>
        prisma.siteConfig.upsert({
          where: { key: config.key },
          update: { value: config.value, description: config.description },
          create: { key: config.key, value: config.value, description: config.description },
        })
      )
    );

    return NextResponse.json({ configs: results });
  } catch (error) {
    console.error("Update config error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
