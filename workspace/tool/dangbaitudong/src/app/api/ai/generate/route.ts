import { randomUUID } from "node:crypto";
import { generateDraft } from "@/lib/ai-router";
import { savePost, type MarketingPost } from "@/lib/marketing-store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  if (!body || !topic) return Response.json({ error: "Nhập chủ đề trước khi tạo bài." }, { status: 400 });
  if (topic.length > 200) return Response.json({ error: "Chủ đề tối đa 200 ký tự." }, { status: 400 });

  try {
    const result = await generateDraft({
      topic,
      brandVoiceId: typeof body.brandVoiceId === "string" ? body.brandVoiceId : undefined,
      brandVoice: typeof body.brandVoice === "string" ? body.brandVoice.slice(0, 500) : undefined,
      audience: typeof body.audience === "string" ? body.audience.slice(0, 300) : undefined,
      trendContext: typeof body.trendContext === "string" ? body.trendContext.slice(0, 1000) : undefined,
      callToAction: typeof body.callToAction === "string" ? body.callToAction.slice(0, 300) : undefined,
      formula: typeof body.formula === "string" ? body.formula.slice(0, 50) : undefined,
    });

    const now = new Date().toISOString();
    const hasHighRisk = result.content.compliance_check.detected_risks.some((r) => r.severity === "high");

    const post: MarketingPost = {
      id: randomUUID(),
      topic,
      title: result.content.post_title_internal,
      formula: result.content.copywriting_formula_used,
      hookType: result.content.hook_type,
      body: result.content.main_content,
      hashtags: result.content.hashtags,
      firstComment: result.content.first_comment,
      artDirectionPrompt: result.content.media_generation.ai_image_prompt_en,
      mediaGeneration: result.content.media_generation,
      compliance: result.content.compliance_check,
      status: hasHighRisk ? "blocked" : result.content.compliance_check.is_safe_for_facebook ? "draft" : "review",
      scheduledAt: null,
      pageId: null,
      facebookPostId: null,
      metrics: null,
      spintaxVariations: result.spintaxVariations,
      bestTimeRecommendation: result.bestTimeRecommendation,
      createdAt: now,
      updatedAt: now,
    };

    await savePost(post);

    return Response.json(
      {
        success: true,
        topic,
        post,
        content: result.content, // Matching Structured Output format
        provider: result.provider,
        model: result.model,
        retrievedWinningExamples: result.retrievedWinningExamples,
        retrievedKnowledgeItems: result.retrievedKnowledgeItems,
        bestTimeRecommendation: result.bestTimeRecommendation,
        spintaxVariations: result.spintaxVariations,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo nội dung.";
    return Response.json({ error: message }, { status: 502 });
  }
}
