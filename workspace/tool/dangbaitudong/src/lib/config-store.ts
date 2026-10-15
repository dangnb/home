import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import type { SystemConfig } from "@/lib/types";

export type { SystemConfig };

const configPath = path.join(process.cwd(), "data", "system-config.json");
const globalConfig = globalThis as typeof globalThis & { systemConfigPool?: Pool };
const pool = process.env.DATABASE_URL
  ? (globalConfig.systemConfigPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3 }))
  : null;

const defaultConfig: SystemConfig = {
  aiProvider: "openai",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  anthropicModel: "claude-3-5-sonnet",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: "gemini-1.5-flash",
  azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
  azureOpenAiKey: process.env.AZURE_OPENAI_API_KEY || "",
  azureOpenAiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT || "",
  replicateApiKey: process.env.REPLICATE_API_KEY || "",

  tier1Model: "gpt-4o-mini",
  tier2Model: "gpt-4o",
  tier3ImageModel: "sharp-programmatic",

  facebookPageId: process.env.FACEBOOK_PAGE_ID || "",
  facebookPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "",
  facebookAppId: process.env.FACEBOOK_APP_ID || "",
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET || "",

  qdrantUrl: process.env.QDRANT_URL || "http://localhost:6333",
  qdrantApiKey: process.env.QDRANT_API_KEY || "",
  qdrantCollection: process.env.QDRANT_COLLECTION || "winning-posts",

  trendFeedUrls: process.env.TREND_FEED_URLS || "https://vnexpress.net/rss/kinh-doanh.rss,https://cafebiz.vn/trang-chu.rss",
  trendKeywords: process.env.TREND_KEYWORDS || "kinh doanh,chạy bộ,sức khỏe,marketing,xu hướng",
};

// Mask secret key for display in UI (e.g. "sk-proj-****...1234")
export function maskSecret(secret?: string): string {
  if (!secret || secret.trim().length === 0) return "";
  const trimmed = secret.trim();
  if (trimmed.length <= 8) return "********";
  return `${trimmed.slice(0, 4)}****...${trimmed.slice(-4)}`;
}

export async function getSystemConfig(): Promise<SystemConfig> {
  let loaded = defaultConfig;

  // Try reading from file
  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<SystemConfig>;
    loaded = { ...defaultConfig, ...parsed };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn("Could not read system config file:", err);
    }
  }

  // Ensure process.env stays synced with loaded config
  if (loaded.openaiApiKey && !process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = loaded.openaiApiKey;
  if (loaded.facebookPageId && !process.env.FACEBOOK_PAGE_ID) process.env.FACEBOOK_PAGE_ID = loaded.facebookPageId;
  if (loaded.facebookPageAccessToken && !process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = loaded.facebookPageAccessToken;
  }
  if (loaded.qdrantUrl && !process.env.QDRANT_URL) process.env.QDRANT_URL = loaded.qdrantUrl;

  return loaded;
}

export async function saveSystemConfig(newConfig: Partial<SystemConfig>): Promise<SystemConfig> {
  const current = await getSystemConfig();

  // Merge values, keeping old secrets if user submits masked string e.g. "sk-****..."
  const updated: SystemConfig = {
    ...current,
    ...newConfig,
  };

  const secretKeys: Array<keyof SystemConfig> = [
    "openaiApiKey",
    "anthropicApiKey",
    "geminiApiKey",
    "azureOpenAiKey",
    "replicateApiKey",
    "facebookPageAccessToken",
    "facebookAppSecret",
    "qdrantApiKey",
  ];

  for (const key of secretKeys) {
    const incoming = newConfig[key];
    if (typeof incoming === "string" && incoming.includes("****")) {
      // User didn't change the masked secret, preserve current
      updated[key] = current[key];
    } else if (typeof incoming === "string" && incoming.trim() === "") {
      updated[key] = "";
    } else if (incoming) {
      updated[key] = incoming;
    }
  }

  // Sync to runtime process.env
  if (updated.openaiApiKey) process.env.OPENAI_API_KEY = updated.openaiApiKey;
  if (updated.openaiModel) process.env.OPENAI_MODEL = updated.openaiModel;
  if (updated.anthropicApiKey) process.env.ANTHROPIC_API_KEY = updated.anthropicApiKey;
  if (updated.geminiApiKey) process.env.GEMINI_API_KEY = updated.geminiApiKey;
  if (updated.azureOpenAiEndpoint) process.env.AZURE_OPENAI_ENDPOINT = updated.azureOpenAiEndpoint;
  if (updated.azureOpenAiKey) process.env.AZURE_OPENAI_API_KEY = updated.azureOpenAiKey;
  if (updated.azureOpenAiDeployment) process.env.AZURE_OPENAI_DEPLOYMENT = updated.azureOpenAiDeployment;
  if (updated.facebookPageId) process.env.FACEBOOK_PAGE_ID = updated.facebookPageId;
  if (updated.facebookPageAccessToken) process.env.FACEBOOK_PAGE_ACCESS_TOKEN = updated.facebookPageAccessToken;
  if (updated.qdrantUrl) process.env.QDRANT_URL = updated.qdrantUrl;
  if (updated.trendFeedUrls) process.env.TREND_FEED_URLS = updated.trendFeedUrls;
  if (updated.trendKeywords) process.env.TREND_KEYWORDS = updated.trendKeywords;

  // Persist to file
  await mkdir(path.dirname(configPath), { recursive: true });
  const tmp = `${configPath}.tmp`;
  await writeFile(tmp, JSON.stringify(updated, null, 2), "utf8");
  await rename(tmp, configPath);

  // Try PostgreSQL persistence if pool exists
  if (pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS system_config (
          id text PRIMARY KEY,
          data jsonb NOT NULL,
          updated_at timestamptz NOT NULL
        );
        INSERT INTO system_config (id, data, updated_at)
        VALUES ('global_config', $1::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
      `, [JSON.stringify(updated)]);
    } catch (e) {
      console.warn("PostgreSQL config save failed, relying on file config.", e);
    }
  }

  return updated;
}
