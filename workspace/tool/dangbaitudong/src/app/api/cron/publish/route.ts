import { publishFacebookPost } from "@/lib/facebook";
import { listPosts, updatePost } from "@/lib/marketing-store";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const duePosts = (await listPosts()).filter(
    (post) => post.status === "scheduled" && post.scheduledAt && new Date(post.scheduledAt).getTime() <= Date.now(),
  );
  const results: Array<{ id: string; ok: boolean; error?: string }> = [];

  for (const post of duePosts) {
    try {
      const risks = post.compliance?.detected_risks ?? [];
      if (risks.some((risk) => risk.severity === "high")) {
        await updatePost(post.id, (current) => ({ ...current, status: "blocked" }));
        results.push({ id: post.id, ok: false, error: "Compliance risk requires manual review." });
        continue;
      }
      const pageId = post.pageId || process.env.FACEBOOK_PAGE_ID;
      if (!pageId) throw new Error("FACEBOOK_PAGE_ID chưa được cấu hình.");
      const facebookPostId = await publishFacebookPost(pageId, `${post.body}\n\n${post.hashtags.join(" ")}`);
      await updatePost(post.id, (current) => ({
        ...current,
        status: "published",
        pageId,
        facebookPostId,
        scheduledAt: null,
      }));
      results.push({ id: post.id, ok: true });
    } catch (error) {
      results.push({ id: post.id, ok: false, error: error instanceof Error ? error.message : "Publish failed." });
    }
  }

  return Response.json({ processed: results.length, results });
}
