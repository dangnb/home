import { generateProgrammaticImage } from "@/lib/image-processor";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const hookText = typeof body?.hookText === "string" ? body.hookText.trim() : "ĐỪNG BẮT ĐẦU KHI CHƯA BIẾT ĐIỀU NÀY!";
  const badgeText = typeof body?.badgeText === "string" ? body.badgeText.trim() : "BÍ QUYẾT VIRAL";
  const themeColor = typeof body?.themeColor === "string" ? body.themeColor : "#06b6d4";
  const brandName = typeof body?.brandName === "string" ? body.brandName : "MARKETING AI · OFFICIAL";

  try {
    const result = await generateProgrammaticImage({
      hookText,
      badgeText,
      themeColor,
      brandName,
    });

    return Response.json({
      success: true,
      image: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo ảnh programmatic.";
    return Response.json({ error: message }, { status: 500 });
  }
}
