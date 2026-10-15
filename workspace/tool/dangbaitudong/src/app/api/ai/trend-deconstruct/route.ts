import { deconstructViralPost } from "@/lib/ai-router";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  if (!topic) return Response.json({ error: "Cần cung cấp chủ đề hoặc URL bài viral." }, { status: 400 });

  const competitorText = typeof body?.competitorText === "string" ? body.competitorText : undefined;
  const competitorImageUrl = typeof body?.competitorImageUrl === "string" ? body.competitorImageUrl : undefined;
  const topComments = Array.isArray(body?.topComments) ? (body.topComments as string[]) : undefined;

  try {
    const analysis = await deconstructViralPost({
      topic,
      competitorText,
      competitorImageUrl,
      topComments,
    });

    return Response.json({
      success: true,
      topic,
      analysis,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể phân tích bài viral.";
    return Response.json({ error: message }, { status: 500 });
  }
}
