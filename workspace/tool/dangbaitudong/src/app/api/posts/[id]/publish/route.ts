import { publishFacebookPost } from "@/lib/facebook";
import { listPosts, updatePost } from "@/lib/marketing-store";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const existing = (await listPosts()).find((item) => item.id === id);
  if (!existing) return Response.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  if (existing.status !== "approved" && existing.status !== "scheduled") {
    return Response.json({ error: "Bài viết cần được duyệt trước khi đăng." }, { status: 409 });
  }
  if (existing.compliance.detected_risks.some((risk) => risk.severity === "high")) {
    return Response.json({ error: "Bài viết đang có rủi ro compliance mức cao." }, { status: 409 });
  }

  try {
    const pageId = existing.pageId || process.env.FACEBOOK_PAGE_ID;
    if (!pageId) return Response.json({ error: "Chưa cấu hình FACEBOOK_PAGE_ID." }, { status: 503 });
    const facebookPostId = await publishFacebookPost(pageId, `${existing.body}\n\n${existing.hashtags.join(" ")}`);
    const updated = await updatePost(id, (current) => ({
      ...current,
      status: "published",
      pageId,
      facebookPostId,
      scheduledAt: null,
    }));
    return Response.json({ post: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Facebook publish thất bại.";
    return Response.json({ error: message }, { status: 502 });
  }
}
