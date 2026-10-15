import { createHash } from "node:crypto";
import Parser from "rss-parser";
import { saveTrend, type MarketingTrend } from "@/lib/marketing-store";

const parser = new Parser();

function signalScore(publishedAt: string | undefined, title: string) {
  const ageHours = publishedAt ? Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3_600_000) : 168;
  const freshness = ageHours <= 24 ? 70 : ageHours <= 72 ? 58 : ageHours <= 168 ? 45 : 30;
  const configuredKeywords = (process.env.TREND_KEYWORDS ?? "")
    .split(",")
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
  const keywordBoost = configuredKeywords.some((keyword) => title.toLowerCase().includes(keyword)) ? 20 : 0;
  return Math.min(100, freshness + keywordBoost);
}

export async function POST() {
  const feedUrls = (process.env.TREND_FEED_URLS ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  if (!feedUrls.length) {
    return Response.json({ trends: [], scanned: 0, message: "Chưa cấu hình TREND_FEED_URLS." });
  }

  const failures: string[] = [];
  const saved: MarketingTrend[] = [];
  for (const feedUrl of feedUrls) {
    let url: URL;
    try {
      url = new URL(feedUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Unsupported protocol");
    } catch {
      failures.push("Một feed URL không hợp lệ.");
      continue;
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`Feed returned ${response.status}.`);
      const feed = await parser.parseString(await response.text());
      for (const item of (feed.items ?? []).slice(0, 25)) {
        const title = item.title?.trim();
        if (!title) continue;
        const urlOrTitle = item.link ?? `${url.hostname}:${title}`;
        const id = createHash("sha256").update(urlOrTitle).digest("hex").slice(0, 32);
        saved.push(await saveTrend({
          id,
          title: title.slice(0, 180),
          keyword: title.slice(0, 100),
          source: url.hostname,
          summary: (item.contentSnippet ?? item.content ?? "").replace(/<[^>]*>/g, " ").trim().slice(0, 1200),
          relevanceScore: signalScore(item.isoDate ?? item.pubDate, title),
          discoveredAt: new Date().toISOString(),
        }));
      }
    } catch {
      failures.push(`Không đọc được feed ${url.hostname}.`);
    }
  }

  return Response.json({ trends: saved, scanned: feedUrls.length, imported: saved.length, failures });
}