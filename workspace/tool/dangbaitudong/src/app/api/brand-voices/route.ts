import { randomUUID } from "node:crypto";
import { listBrandVoices, saveBrandVoice, type BrandVoice } from "@/lib/marketing-store";

export async function GET() {
  const voices = await listBrandVoices();
  return Response.json({ voices });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const systemPrompt = typeof body?.systemPrompt === "string" ? body.systemPrompt.trim() : "";

  if (!name || !systemPrompt) {
    return Response.json({ error: "Tên thương hiệu và System Prompt là bắt buộc." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const voice: BrandVoice = {
    id: typeof body?.id === "string" && body.id ? body.id : randomUUID(),
    workspaceId: "default-workspace",
    name,
    systemPrompt,
    tone: typeof body?.tone === "string" ? body.tone : "Thực tế, gần gũi, chuyên nghiệp",
    targetAudience: typeof body?.targetAudience === "string" ? body.targetAudience : "Khách hàng mục tiêu",
    preferredFormulas: Array.isArray(body?.preferredFormulas) ? (body.preferredFormulas as string[]) : ["PAS", "AIDA"],
    autoTuningHistory: Array.isArray(body?.autoTuningHistory) ? (body.autoTuningHistory as BrandVoice["autoTuningHistory"]) : [],
    createdAt: now,
    updatedAt: now,
  };

  const saved = await saveBrandVoice(voice);
  return Response.json({ success: true, brandVoice: saved }, { status: 201 });
}
