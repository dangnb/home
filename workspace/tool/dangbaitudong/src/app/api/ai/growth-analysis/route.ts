import { runGrowthAnalyst } from "@/lib/ai-router";
import {
  listBrandVoices,
  listGrowthReports,
  listPosts,
  saveBrandVoice,
  saveGrowthReport,
} from "@/lib/marketing-store";

export async function GET() {
  const reports = await listGrowthReports();
  return Response.json({ reports });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const action = typeof body?.action === "string" ? body.action : "analyze";

  const [posts, voices] = await Promise.all([listPosts(), listBrandVoices()]);
  const activeVoice = voices[0];

  if (action === "accept_auto_tune") {
    const suggestedPrompt = typeof body?.suggestedPrompt === "string" ? body.suggestedPrompt : "";
    const reason = typeof body?.reason === "string" ? body.reason : "Auto-tuned based on weekly A/B winners";

    if (!suggestedPrompt || !activeVoice) {
      return Response.json({ error: "Không tìm thấy Brand Voice hoặc Prompt hợp lệ." }, { status: 400 });
    }

    const updatedVoice = {
      ...activeVoice,
      systemPrompt: suggestedPrompt,
      autoTuningHistory: [
        ...(activeVoice.autoTuningHistory || []),
        {
          date: new Date().toISOString(),
          reason,
          oldPrompt: activeVoice.systemPrompt,
          newPrompt: suggestedPrompt,
          accepted: true,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    await saveBrandVoice(updatedVoice);
    return Response.json({ success: true, brandVoice: updatedVoice, message: "Đã cập nhật System Prompt thành công!" });
  }

  // Run full growth analysis
  const report = await runGrowthAnalyst(posts, activeVoice);
  await saveGrowthReport(report);

  return Response.json({
    success: true,
    report,
    currentBrandVoice: activeVoice,
  });
}
