import { randomUUID } from "node:crypto";
import { listTrends, saveTrend, type MarketingTrend } from "@/lib/marketing-store";

export async function GET() {
  return Response.json({ trends: await listTrends() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const keyword = typeof body?.keyword === "string" ? body.keyword.trim() : "";
  const summary = typeof body?.summary === "string" ? body.summary.trim() : "";
  if (!title || !keyword) return Response.json({ error: "Cần có tiêu đề và từ khóa trend." }, { status: 400 });
  if (title.length > 180 || keyword.length > 100 || summary.length > 1200) {
    return Response.json({ error: "Dữ liệu trend vượt quá độ dài cho phép." }, { status: 400 });
  }

  const trend: MarketingTrend = {
    id: randomUUID(),
    title,
    keyword,
    source: "Nhập thủ công",
    summary,
    relevanceScore: 50,
    discoveredAt: new Date().toISOString(),
  };
  return Response.json({ trend: await saveTrend(trend) }, { status: 201 });
}