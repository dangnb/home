import { fetchFacebookInsights } from "@/lib/facebook";
import { indexWinningPost } from "@/lib/qdrant";
import { listPosts, updatePost, type MarketingPost } from "@/lib/marketing-store";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const published = (await listPosts()).filter((post) => post.status === "published" && post.facebookPostId);
  const refreshed: MarketingPost[] = [];
  const failures: Array<{ id: string; error: string }> = [];

  for (const post of published) {
    try {
      const metrics = await fetchFacebookInsights(post.facebookPostId!);
      const updated = await updatePost(post.id, (current) => ({ ...current, metrics }));
      if (updated) refreshed.push(updated);
    } catch (error) {
      failures.push({ id: post.id, error: error instanceof Error ? error.message : "Insights unavailable." });
    }
  }

  const winners = refreshed
    .filter((post) => Boolean(post.metrics?.impressions))
    .sort((a, b) => (b.metrics!.engagements / b.metrics!.impressions) - (a.metrics!.engagements / a.metrics!.impressions))
    .slice(0, 3);
  await Promise.all(winners.map((post) => indexWinningPost(post)));
  return Response.json({ refreshed: refreshed.length, indexedWinners: winners.length, failures });
}