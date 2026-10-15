import { getSystemConfig, maskSecret, saveSystemConfig, type SystemConfig } from "@/lib/config-store";
import { isFacebookConfigured } from "@/lib/facebook";
import { getStorageMode } from "@/lib/marketing-store";

export async function GET() {
  const config = await getSystemConfig();

  const maskedConfig = {
    ...config,
    openaiApiKey: maskSecret(config.openaiApiKey),
    anthropicApiKey: maskSecret(config.anthropicApiKey),
    geminiApiKey: maskSecret(config.geminiApiKey),
    azureOpenAiKey: maskSecret(config.azureOpenAiKey),
    replicateApiKey: maskSecret(config.replicateApiKey),
    facebookPageAccessToken: maskSecret(config.facebookPageAccessToken),
    facebookAppSecret: maskSecret(config.facebookAppSecret),
    qdrantApiKey: maskSecret(config.qdrantApiKey),
  };

  const hasAi = Boolean(
    config.openaiApiKey ||
      (config.azureOpenAiKey && config.azureOpenAiEndpoint) ||
      config.anthropicApiKey ||
      config.geminiApiKey,
  );

  return Response.json({
    config: maskedConfig,
    providers: {
      ai: hasAi,
      facebook: isFacebookConfigured(),
      qdrant: Boolean(config.qdrantUrl && config.openaiApiKey),
      postgresConfigured: Boolean(process.env.DATABASE_URL),
      storageMode: getStorageMode(),
      trendFeeds: Boolean(config.trendFeedUrls),
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });

  const action = typeof body.action === "string" ? body.action : "save";

  // --- ACTION: TEST AI CONNECTION ---
  if (action === "test_ai") {
    const config = await getSystemConfig();
    const startTime = Date.now();
    const apiKey = (typeof body.apiKey === "string" && !body.apiKey.includes("****") ? body.apiKey : config.openaiApiKey) || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json({
        success: false,
        error: "Chưa nhập API Key. Hãy nhập OpenAI API Key để kiểm tra.",
      }, { status: 400 });
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: config.tier1Model || "gpt-4o-mini",
          max_tokens: 30,
          messages: [{ role: "user", content: "Ping test. Trả lời 'OK - AI Agent Ready' trong 5 từ." }],
        }),
      });

      const latencyMs = Date.now() - startTime;
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return Response.json({
          success: false,
          error: `API trả lỗi ${response.status}: ${errorData?.error?.message || "Không xác định"}`,
        }, { status: 400 });
      }

      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const reply = data.choices?.[0]?.message?.content?.trim() || "OK";

      return Response.json({
        success: true,
        message: `Kết nối thành công tới ${config.tier1Model}! Phản hồi: "${reply}" (${latencyMs}ms)`,
        latencyMs,
      });
    } catch (err) {
      return Response.json({
        success: false,
        error: err instanceof Error ? err.message : "Lỗi kết nối tới AI Provider.",
      }, { status: 500 });
    }
  }

  // --- ACTION: TEST FACEBOOK GRAPH API ---
  if (action === "test_facebook") {
    const config = await getSystemConfig();
    const pageId = (typeof body.pageId === "string" ? body.pageId : config.facebookPageId) || process.env.FACEBOOK_PAGE_ID;
    const token = (typeof body.token === "string" && !body.token.includes("****") ? body.token : config.facebookPageAccessToken) || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !token) {
      return Response.json({
        success: false,
        error: "Chưa cấu hình FACEBOOK_PAGE_ID hoặc FACEBOOK_PAGE_ACCESS_TOKEN.",
      }, { status: 400 });
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v23.0/${pageId}?fields=id,name,fan_count&access_token=${token}`);
      const data = await response.json() as { id?: string; name?: string; fan_count?: number; error?: { message?: string } };

      if (!response.ok || data.error) {
        return Response.json({
          success: false,
          error: data.error?.message || `Facebook Graph API trả về mã lỗi ${response.status}.`,
        }, { status: 400 });
      }

      return Response.json({
        success: true,
        message: `Kết nối thành công Fanpage: "${data.name}" (ID: ${data.id}) · Người theo dõi: ${data.fan_count ?? "N/A"}`,
      });
    } catch (err) {
      return Response.json({
        success: false,
        error: err instanceof Error ? err.message : "Lỗi kiểm tra Facebook Graph API.",
      }, { status: 500 });
    }
  }

  // --- ACTION: SAVE SETTINGS ---
  const incomingConfig = (typeof body.config === "object" && body.config ? body.config : body) as Partial<SystemConfig>;
  const saved = await saveSystemConfig(incomingConfig);

  const masked = {
    ...saved,
    openaiApiKey: maskSecret(saved.openaiApiKey),
    anthropicApiKey: maskSecret(saved.anthropicApiKey),
    geminiApiKey: maskSecret(saved.geminiApiKey),
    azureOpenAiKey: maskSecret(saved.azureOpenAiKey),
    replicateApiKey: maskSecret(saved.replicateApiKey),
    facebookPageAccessToken: maskSecret(saved.facebookPageAccessToken),
    facebookAppSecret: maskSecret(saved.facebookAppSecret),
    qdrantApiKey: maskSecret(saved.qdrantApiKey),
  };

  return Response.json({
    success: true,
    message: "Đã lưu và đồng bộ cấu hình hệ thống AI thành công!",
    config: masked,
  });
}
