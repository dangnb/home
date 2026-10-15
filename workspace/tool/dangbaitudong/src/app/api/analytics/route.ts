import { getUsage, listPosts } from "@/lib/marketing-store";

export async function GET() {
  const [posts, usage] = await Promise.all([listPosts(), getUsage()]);
  const published = posts.filter((post) => post.status === "published");
  const impressions = published.reduce((sum, post) => sum + (post.metrics?.impressions ?? 0), 0);
  const engagements = published.reduce((sum, post) => sum + (post.metrics?.engagements ?? 0), 0);
  const clicks = published.reduce((sum, post) => sum + (post.metrics?.clicks ?? 0), 0);
  const recentCost = usage
    .filter((item) => Date.now() - new Date(item.createdAt).getTime() < 24 * 60 * 60 * 1000)
    .reduce((sum, item) => sum + item.estimatedCostUsd, 0);
  const topPosts = published
    .filter((post) => (post.metrics?.impressions ?? 0) > 0)
    .map((post) => ({
      id: post.id,
      title: post.title,
      engagementRate: (post.metrics!.engagements / post.metrics!.impressions) * 100,
    }))
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 5);

  return Response.json({
    totals: {
      drafts: posts.filter((post) => ["draft", "review", "blocked"].includes(post.status)).length,
      scheduled: posts.filter((post) => post.status === "scheduled").length,
      published: published.length,
      impressions,
      engagements,
      clicks,
      engagementRate: impressions ? (engagements / impressions) * 100 : null,
      aiCostLast24h: recentCost,
      tokensLast24h: usage
        .filter((item) => Date.now() - new Date(item.createdAt).getTime() < 24 * 60 * 60 * 1000)
        .reduce((sum, item) => sum + item.promptTokens + item.completionTokens, 0),
    },
    topPosts,
    usage: usage.slice(0, 20),
  });
}