import { scanCompliance } from "@/lib/compliance";
import { updatePost, type PostStatus } from "@/lib/marketing-store";

const editableStatuses: PostStatus[] = ["draft", "review", "approved", "scheduled"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Request body không hợp lệ." }, { status: 400 });

  const result = await updatePost(id, (post) => {
    if (typeof body.title === "string") post.title = body.title.trim().slice(0, 180);
    if (typeof body.body === "string") post.body = body.body.trim().slice(0, 10000);
    if (typeof body.firstComment === "string") post.firstComment = body.firstComment.trim().slice(0, 2000);
    if (typeof body.pageId === "string") post.pageId = body.pageId.trim().slice(0, 100);
    if (typeof body.scheduledAt === "string") post.scheduledAt = body.scheduledAt;

    const text = `${post.title}\n${post.body}\n${post.firstComment}`;
    post.compliance = scanCompliance(text);
    if (post.compliance.detected_risks.some((risk) => risk.severity === "high")) post.status = "blocked";

    if (typeof body.status === "string") {
      if (!editableStatuses.includes(body.status as PostStatus)) return null;
      const status = body.status as PostStatus;
      if (status === "approved" && !post.compliance.is_safe_for_facebook) return null;
      if (status === "scheduled") {
        const scheduledAt = post.scheduledAt ? new Date(post.scheduledAt).getTime() : NaN;
        if (post.status !== "approved" || !Number.isFinite(scheduledAt) || scheduledAt <= Date.now()) return null;
      }
      post.status = status;
    }
    return post;
  });

  if (!result) {
    return Response.json(
      { error: "Không thể cập nhật bài viết. Hãy kiểm tra trạng thái duyệt và thời gian lên lịch." },
      { status: 400 },
    );
  }
  return Response.json({ post: result });
}
