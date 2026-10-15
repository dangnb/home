"use client";

import { FormEvent, useState } from "react";

type GeneratedResult = {
  success: boolean;
  topic: string;
  content: {
    post_title_internal: string;
    copywriting_formula_used: string;
    hook_type: string;
    main_content: string;
    hashtags: string[];
    first_comment: string;
    media_generation?: {
      recommended_format: string;
      ai_image_prompt_en: string;
      overlay_text_vi: string;
      image_data_url?: string;
    };
    compliance_check: {
      is_safe_for_facebook: boolean;
      detected_risks: Array<string | { code: string; severity: string; message: string }>;
      predicted_engagement_score: number;
    };
  };
};

export default function AiGenerator() {
  const [topic, setTopic] = useState("Bán hàng mùa đông");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Không thể tạo nội dung AI.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Phòng Marketing Đa Tác Tử</p>
          <h2 className="mt-2 text-2xl font-bold">Sinh bài viết theo chủ đề</h2>
          <p className="mt-1 text-xs text-slate-400">
            Tự động tích hợp RAG Sản Phẩm + Art Director + Meta Compliance Guard.
          </p>
        </div>

        <label className="mb-2 block text-sm text-slate-300">Chủ đề / keyword</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400"
          placeholder="VD: Mẹo chạy bộ mùa đông, tăng sales..."
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Đang chạy 5 AI Agents..." : "Tạo bài viết AI"}
        </button>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </form>

      <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-6">
        {result ? (
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Structured Output</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{result.content.post_title_internal}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Formula & Hook</p>
                <p className="mt-2 text-lg font-semibold text-cyan-300">
                  {result.content.copywriting_formula_used} · {result.content.hook_type}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Safety & Score</p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">
                  {result.content.compliance_check.is_safe_for_facebook ? "Safe ✓" : "Need review ⚠"}
                  {" · "}
                  {result.content.compliance_check.predicted_engagement_score}/10
                </p>
              </div>
            </div>

            {/* Art Director Live Preview Image */}
            {result.content.media_generation?.image_data_url ? (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <img
                  src={result.content.media_generation.image_data_url}
                  alt="Art Director Output"
                  className="w-full max-h-[300px] object-cover"
                />
              </div>
            ) : null}

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Main content</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
                {result.content.main_content}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">First comment</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{result.content.first_comment}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hashtags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.content.hashtags.map((tag) => (
                  <span key={tag} className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[320px] items-center justify-center text-center text-slate-400">
            Chưa có dữ liệu. Nhập chủ đề để AI sinh nội dung cho bạn.
          </div>
        )}
      </div>
    </div>
  );
}
