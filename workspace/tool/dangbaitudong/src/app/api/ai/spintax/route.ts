import {
  calculateBestTimeToPost,
  defaultTargetChannels,
  generateLocalContextualSpintax,
  type TargetChannelConfig,
} from "@/lib/spintax-engine";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const title = typeof body?.title === "string" ? body.title : "";
  const mainContent = typeof body?.mainContent === "string" ? body.mainContent : "";
  const firstComment = typeof body?.firstComment === "string" ? body.firstComment : "";

  if (!mainContent) {
    return Response.json({ error: "Cần cung cấp nội dung bài viết gốc để sinh biến thể." }, { status: 400 });
  }

  const channels = (Array.isArray(body?.channels) ? body.channels : defaultTargetChannels) as TargetChannelConfig[];
  const variations = generateLocalContextualSpintax(title, mainContent, firstComment, channels);

  const contentType = (body?.contentType === "viral_entertainment" ? "viral_entertainment" : "b2b_sales_knowledge");
  const bestTime = calculateBestTimeToPost(contentType);

  return Response.json({
    success: true,
    variations,
    bestTimeRecommendation: bestTime,
  });
}
