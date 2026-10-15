import { getStorageMode } from "@/lib/marketing-store";
import { isFacebookConfigured } from "@/lib/facebook";

export async function GET() {
  return Response.json({
    providers: {
      ai: Boolean(process.env.OPENAI_API_KEY || (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT)),
      facebook: isFacebookConfigured(),
      qdrant: Boolean(process.env.QDRANT_URL && process.env.OPENAI_API_KEY),
      postgresConfigured: Boolean(process.env.DATABASE_URL),
      storageMode: getStorageMode(),
      trendFeeds: Boolean(process.env.TREND_FEED_URLS),
    },
  });
}