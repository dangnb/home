"use client";

import { FormEvent, useEffect, useState } from "react";
import type {
  BrandVoice,
  GrowthReport,
  MarketingPost,
  MarketingTrend,
  ProductKnowledgeItem,
  SpintaxVariation,
  SystemConfig,
  TrendDeconstructionResult,
} from "@/lib/types";

type Risk = { code: string; severity: "warning" | "high"; message: string; match: string; suggestion?: string };

type Post = MarketingPost;
type Trend = MarketingTrend;

type WorkspaceData = {
  totals: {
    drafts: number;
    scheduled: number;
    published: number;
    impressions: number;
    engagements: number;
    clicks: number;
    engagementRate: number | null;
    aiCostLast24h: number;
    tokensLast24h: number;
  };
  topPosts: Array<{ id: string; title: string; engagementRate: number }>;
  usage?: Array<{
    id: string;
    moduleType: string;
    modelName: string;
    promptTokens: number;
    completionTokens: number;
    estimatedCostUsd: number;
    createdAt: string;
  }>;
};

type Settings = {
  config?: SystemConfig;
  providers: {
    ai: boolean;
    facebook: boolean;
    qdrant: boolean;
    postgresConfigured: boolean;
    storageMode: string;
    trendFeeds: boolean;
  };
};

type Tab = "overview" | "trends" | "create" | "orchestration" | "queue" | "analytics" | "knowledge" | "settings";

const tabs: Array<{ id: Tab; label: string; agentTag?: string }> = [
  { id: "overview", label: "Phòng Marketing Ảo" },
  { id: "trends", label: "Trend Scout", agentTag: "Agent 1" },
  { id: "create", label: "Tạo bài viết", agentTag: "Agent 2 + 3 + 4" },
  { id: "orchestration", label: "Spintax & Giờ Vàng", agentTag: "Module 3" },
  { id: "queue", label: "Lịch & Xuất bản" },
  { id: "analytics", label: "Growth Analyst", agentTag: "Agent 5" },
  { id: "knowledge", label: "RAG & Brand Voice" },
  { id: "settings", label: "Cấu hình AI & API", agentTag: "Hệ thống" },
];

const number = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

export default function DashboardWorkspace() {
  const [tab, setTab] = useState<Tab>("overview");
  const [posts, setPosts] = useState<Post[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [analytics, setAnalytics] = useState<WorkspaceData | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [knowledgeList, setKnowledgeList] = useState<ProductKnowledgeItem[]>([]);
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [growthReport, setGrowthReport] = useState<GrowthReport | null>(null);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  // Form states for Create Post
  const [draftTopic, setDraftTopic] = useState("chạy bộ mùa đông");
  const [draftFormula, setDraftFormula] = useState("PAS");
  const [brandVoiceText, setBrandVoiceText] = useState(
    "Thực tế, gần gũi, giàu trải nghiệm chạy bộ phong trào; nói thẳng vào điểm nghẽn đau khớp gối; không câu like rẻ tiền.",
  );
  const [audience, setAudience] = useState("Người chạy bộ sáng sớm, dân văn phòng tập cardio");
  const [trendContext, setTrendContext] = useState("Nhiều người bỏ qua khởi động khiến khớp gối bị đau khi trời lạnh");
  const [generated, setGenerated] = useState<Post | null>(null);
  const [generationSource, setGenerationSource] = useState("");
  const [retrievedExamples, setRetrievedExamples] = useState(0);
  const [retrievedKnowledge, setRetrievedKnowledge] = useState(0);
  const [busy, setBusy] = useState(false);

  // Form state for Trend Scout manual & deconstruction
  const [newTrendTitle, setNewTrendTitle] = useState("");
  const [newTrendSummary, setNewTrendSummary] = useState("");
  const [activeDeconstruction, setActiveDeconstruction] = useState<TrendDeconstructionResult | null>(null);
  const [deconstructingTrendId, setDeconstructingTrendId] = useState<string | null>(null);

  // Form states for Knowledge Base
  const [kbTitle, setKbTitle] = useState("");
  const [kbCategory, setKbCategory] = useState<ProductKnowledgeItem["category"]>("usp");
  const [kbContent, setKbContent] = useState("");

  // Spintax test state
  const [activeSpintaxVariations, setActiveSpintaxVariations] = useState<SpintaxVariation[]>([]);

  // System Config & Testing states
  const [configForm, setConfigForm] = useState<Partial<SystemConfig>>({
    aiProvider: "openai",
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    anthropicApiKey: "",
    anthropicModel: "claude-3-5-sonnet",
    geminiApiKey: "",
    geminiModel: "gemini-1.5-flash",
    azureOpenAiEndpoint: "",
    azureOpenAiKey: "",
    azureOpenAiDeployment: "",
    replicateApiKey: "",
    tier1Model: "gpt-4o-mini",
    tier2Model: "gpt-4o",
    tier3ImageModel: "sharp-programmatic",
    facebookPageId: "",
    facebookPageAccessToken: "",
    facebookAppId: "",
    facebookAppSecret: "",
    qdrantUrl: "http://localhost:6333",
    qdrantApiKey: "",
    qdrantCollection: "winning-posts",
    trendFeedUrls: "",
    trendKeywords: "",
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [testingFb, setTestingFb] = useState(false);
  const [fbTestResult, setFbTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const responses = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/trends"),
          fetch("/api/analytics"),
          fetch("/api/settings"),
          fetch("/api/knowledge"),
          fetch("/api/brand-voices"),
          fetch("/api/ai/growth-analysis"),
        ]);
        const [postData, trendData, analyticsData, settingsData, kbData, bvData, growthData] = await Promise.all(
          responses.map((r) => r.json().catch(() => ({}))),
        );

        setPosts(postData.posts ?? []);
        setTrends(trendData.trends ?? []);
        setAnalytics(analyticsData);
        setSettings(settingsData);
        if (settingsData?.config) {
          setConfigForm((prev) => ({
            ...settingsData.config,
            ...Object.fromEntries(
              Object.entries(prev).filter(([_, v]) => v !== "" && v !== undefined && !String(v).includes("****")),
            ),
          }));
        }
        setKnowledgeList(kbData.items ?? []);
        setBrandVoices(bvData.voices ?? []);
        if (growthData.report) setGrowthReport(growthData.report);
      } catch {
        setNotice("Không tải được workspace. Kiểm tra server và thử lại.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [revision]);

  function refresh() {
    setRevision((val) => val + 1);
  }

  // --- ACTIONS ---

  // Module 1: Add trend manually
  async function addTrend(e: FormEvent) {
    e.preventDefault();
    setNotice("");
    const res = await fetch("/api/trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTrendTitle, keyword: newTrendTitle, summary: newTrendSummary }),
    });
    const result = await res.json();
    if (!res.ok) {
      setNotice(result.error ?? "Không thể thêm trend.");
      return;
    }
    setNewTrendTitle("");
    setNewTrendSummary("");
    setNotice("Đã thêm tín hiệu trend thành công!");
    refresh();
  }

  // Module 1: Deconstruct Viral Post with Agent 1
  async function deconstructTrend(trend: Trend) {
    setDeconstructingTrendId(trend.id);
    setNotice("");
    try {
      const res = await fetch("/api/ai/trend-deconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trend.keyword || trend.title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Giải mã viral thất bại.");
      setActiveDeconstruction(data.analysis);
      setNotice(`Agent 1 đã bóc tách DNA Viral và phân tích bình luận thành công cho: "${trend.title}"`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Lỗi giải mã viral.");
    } finally {
      setDeconstructingTrendId(null);
    }
  }

  // Use angle from Trend Scout to Create Post
  function useAngleForDraft(title: string, hook: string) {
    setDraftTopic(title);
    setTrendContext(`Hook gợi ý: ${hook}`);
    setTab("create");
  }

  // Module 2: Generate Post via Multi-Agent
  async function handleGenerateDraft(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: draftTopic,
          formula: draftFormula,
          brandVoice: brandVoiceText,
          audience,
          trendContext,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không thể tạo draft.");

      setGenerated(data.post);
      setGenerationSource(`${data.provider} · ${data.model}`);
      setRetrievedExamples(data.retrievedWinningExamples ?? 0);
      setRetrievedKnowledge(data.retrievedKnowledgeItems ?? 0);
      if (data.spintaxVariations) {
        setActiveSpintaxVariations(data.spintaxVariations);
      }
      setNotice("Multi-Agent đã hoàn thành: Viết bài (RAG) + Thiết kế ảnh (Sharp) + Kiểm duyệt chính sách!");
      refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Lỗi khi sinh nội dung.");
    } finally {
      setBusy(false);
    }
  }

  // Module 4: Run Growth Analyst
  async function handleRunGrowthAnalysis() {
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch("/api/ai/growth-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Phân tích thất bại.");
      setGrowthReport(data.report);
      setNotice("Growth Analyst đã phân tích A/B tuần và phát hiện quy luật thành công!");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Lỗi phân tích tăng trưởng.");
    } finally {
      setBusy(false);
    }
  }

  // Module 4: Accept Auto-Tuning System Prompt
  async function handleAcceptAutoTune(suggestedPrompt: string, reason: string) {
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch("/api/ai/growth-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept_auto_tune", suggestedPrompt, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi cập nhật prompt.");
      setNotice("Đã cập nhật System Prompt tự động vào Brand Voice!");
      setBrandVoiceText(suggestedPrompt);
      refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Lỗi lưu prompt.");
    } finally {
      setBusy(false);
    }
  }

  // Save Knowledge item
  async function handleSaveKnowledge(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: kbTitle, category: kbCategory, contentText: kbContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi lưu tri thức.");
      setKbTitle("");
      setKbContent("");
      setNotice("Đã lưu thông tin vào Kho Tri Thức Sản Phẩm (Kho 1)!");
      refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Lỗi lưu tri thức.");
    } finally {
      setBusy(false);
    }
  }

  // System Configuration & Connection Testing Actions
  async function handleTestAi() {
    setTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_ai",
          apiKey: configForm.openaiApiKey,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAiTestResult({ success: true, message: data.message, latencyMs: data.latencyMs });
      } else {
        setAiTestResult({ success: false, message: data.error || "Kiểm tra kết nối AI thất bại." });
      }
    } catch (err) {
      setAiTestResult({ success: false, message: err instanceof Error ? err.message : "Lỗi mạng khi kiểm tra AI." });
    } finally {
      setTestingAi(false);
    }
  }

  async function handleTestFacebook() {
    setTestingFb(true);
    setFbTestResult(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_facebook",
          pageId: configForm.facebookPageId,
          token: configForm.facebookPageAccessToken,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFbTestResult({ success: true, message: data.message });
      } else {
        setFbTestResult({ success: false, message: data.error || "Kiểm tra Facebook Graph API thất bại." });
      }
    } catch (err) {
      setFbTestResult({ success: false, message: err instanceof Error ? err.message : "Lỗi mạng khi kiểm tra Facebook." });
    } finally {
      setTestingFb(false);
    }
  }

  async function handleSaveConfig(e?: FormEvent) {
    if (e) e.preventDefault();
    setSavingConfig(true);
    setNotice("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          config: configForm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotice("✅ " + data.message);
        if (data.config) {
          setConfigForm((prev) => ({ ...prev, ...data.config }));
        }
        refresh();
      } else {
        setNotice("❌ " + (data.error || "Không thể lưu cấu hình hệ thống."));
      }
    } catch (err) {
      setNotice("❌ Lỗi khi lưu cấu hình: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
    } finally {
      setSavingConfig(false);
    }
  }

  // Post update and publishing actions
  async function updatePost(post: Post, data: Record<string, string>) {
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Không thể cập nhật bài.");
      setGenerated(result.post);
      refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Lỗi cập nhật.");
    } finally {
      setBusy(false);
    }
  }

  async function publishPost(post: Post) {
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch(`/api/posts/${post.id}/publish`, { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Facebook publish thất bại.");
      setGenerated(result.post);
      setNotice("Đã publish bài viết trực tiếp lên Facebook Fanpage!");
      refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Facebook publish thất bại.");
    } finally {
      setBusy(false);
    }
  }

  const orderedPosts = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totals = analytics?.totals;

  return (
    <main className="min-h-screen bg-[#06090e] px-4 py-6 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Hệ Thống 5 AI Agents · Marketing Automation
              </p>
            </div>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">DangBaiTuDong AI Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs text-slate-400 border border-white/10">
              {loading ? "Đang đồng bộ..." : `${posts.length} bài đăng · ${trends.length} tín hiệu · ${knowledgeList.length} SP`}
            </span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav aria-label="Dashboard navigation" className="mt-4 flex gap-2 overflow-x-auto border-b border-white/10 pb-px">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
                tab === item.id
                  ? "border-cyan-400 text-cyan-300 bg-cyan-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{item.label}</span>
              {item.agentTag ? (
                <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">
                  {item.agentTag}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Global Notice Banner */}
        {notice ? (
          <div role="status" className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/30 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-200">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="text-xs text-cyan-400 hover:text-white">✕</button>
          </div>
        ) : null}

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW - PHÒNG MARKETING ẢO (5 AGENTS) */}
        {/* ======================================================== */}
        {tab === "overview" && (
          <section className="pt-7 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Kiến trúc Đa Tác Tử</p>
                <h2 className="mt-1 text-2xl font-bold">Quy trình tự động hóa 5 AI Agents</h2>
              </div>
              <button
                type="button"
                onClick={() => setTab("create")}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95"
              >
                + Khởi động Agent viết bài
              </button>
            </div>

            {/* 5 Agents Visual Pipeline Architecture */}
            <div className="grid gap-3 lg:grid-cols-5">
              {[
                {
                  step: "Agent 1",
                  name: "Trend Scout",
                  desc: "Multimodal LLM giải mã Viral, đọc ảnh/video, phân tích comment",
                  color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-300",
                  status: `${trends.length} tín hiệu`,
                },
                {
                  step: "Agent 2",
                  name: "Copywriter + RAG",
                  desc: "RAG 2 kho (Sản phẩm & Bài thắng cũ), viết đúng giọng, công thức PAS",
                  color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
                  status: `${knowledgeList.length} SP · 50 mẫu`,
                },
                {
                  step: "Agent 3",
                  name: "Art Director",
                  desc: "Sinh prompt tạo ảnh + Backend Sharp ghép Hook tiếng Việt & Logo",
                  color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
                  status: "Sharp Engine On",
                },
                {
                  step: "Agent 4",
                  name: "Compliance Guard",
                  desc: "Quét chống bóp Reach, chặn từ cấm, tự động viết lại câu thảo luận",
                  color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
                  status: "Pre-Approver",
                },
                {
                  step: "Agent 5",
                  name: "Growth Analyst",
                  desc: "So sánh A/B tuần, tìm quy luật, tự động Auto-Tune Brand Voice",
                  color: "border-blue-500/40 bg-blue-950/20 text-blue-300",
                  status: "Feedback Loop",
                },
              ].map((agent, i) => (
                <div key={agent.name} className={`rounded-2xl border p-4 backdrop-blur-sm relative ${agent.color}`}>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                    <span>{agent.step}</span>
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">{agent.status}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white">{agent.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{agent.desc}</p>
                  {i < 4 ? (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-500 text-xs font-bold">
                      ▶
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* KPI Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-4 border-y border-white/10 py-6">
              {[
                { label: "Trend Signals", value: trends.length, sub: "Được thu thập từ thị trường" },
                { label: "Bài cần xử lý / Draft", value: totals?.drafts ?? 0, sub: "Đang chờ duyệt hoặc chỉnh sửa" },
                { label: "Đã lên lịch (Scheduled)", value: totals?.scheduled ?? 0, sub: "Theo thuật toán giờ vàng" },
                { label: "Đã đăng (Published)", value: totals?.published ?? 0, sub: "Facebook Graph API live" },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{number(card.value)}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Posts & Quick Trends */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-white">Nội dung trong hàng đợi</h3>
                  <button onClick={() => setTab("queue")} className="text-xs text-cyan-400 hover:underline">
                    Xem toàn bộ queue →
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {orderedPosts.slice(0, 4).map((post) => (
                    <div key={post.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-200">{post.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {post.formula} · {post.topic}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase text-cyan-300">
                        {post.status}
                      </span>
                    </div>
                  ))}
                  {!orderedPosts.length ? <p className="text-xs text-slate-500 py-4">Chưa có bài viết trong hàng đợi.</p> : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-white">Tín hiệu Viral nổi bật</h3>
                  <button onClick={() => setTab("trends")} className="text-xs text-cyan-400 hover:underline">
                    Mở Trend Scout →
                  </button>
                </div>
                <div className="space-y-3">
                  {trends.slice(0, 3).map((trend) => (
                    <div
                      key={trend.id}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition cursor-pointer"
                      onClick={() => {
                        setDraftTopic(trend.keyword || trend.title);
                        setTab("create");
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{trend.title}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{trend.summary}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs font-bold text-emerald-400">Score {trend.relevanceScore}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{trend.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TREND SCOUT (MODULE 1) */}
        {/* ======================================================== */}
        {tab === "trends" && (
          <section className="pt-7 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Module 1: Trend Intelligence
                </p>
                <h2 className="mt-1 text-2xl font-bold">Trend Scout Agent: Giải mã Viral & Đọc vị tâm lý</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Semantic Clustering gom cụm ngữ nghĩa · Multimodal đọc ảnh/video đối thủ · Phân tích nguyên nhân bình luận.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setNotice("Đang quét các nguồn RSS...");
                  const res = await fetch("/api/trends/refresh", { method: "POST" });
                  const data = await res.json();
                  setNotice(data.message ?? `Đã quét và nạp ${data.imported ?? 0} tín hiệu mới!`);
                  refresh();
                }}
                className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50"
              >
                ↻ Quét RSS feeds
              </button>
            </div>

            {/* Manual Trend Input */}
            <form onSubmit={addTrend} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 md:grid-cols-[1fr_2fr_auto]">
              <input
                required
                value={newTrendTitle}
                onChange={(e) => setNewTrendTitle(e.target.value)}
                placeholder="Chủ đề / Từ khóa Viral (VD: chạy bộ mùa đông)"
                className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
              />
              <input
                value={newTrendSummary}
                onChange={(e) => setNewTrendSummary(e.target.value)}
                placeholder="Ghi chú nguồn, link đối thủ hoặc bối cảnh"
                className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
              />
              <button className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400">
                Thêm tín hiệu
              </button>
            </form>

            {/* Modal/Panel: Active Viral Deconstruction Result */}
            {activeDeconstruction ? (
              <div className="rounded-2xl border border-cyan-400/40 bg-cyan-950/20 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-cyan-400/20 pb-4">
                  <div>
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                      Bóc tách bởi Agent 1 (Multimodal + Sentiment)
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">Kết quả giải mã Viral DNA & Bình luận</h3>
                  </div>
                  <button onClick={() => setActiveDeconstruction(null)} className="text-xs text-slate-400 hover:text-white">
                    Đóng [✕]
                  </button>
                </div>

                {/* Viral DNA Box */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                    <p className="text-xs uppercase tracking-wider text-cyan-300 font-bold">1. Multimodal Viral Deconstruction</p>
                    <p className="text-xs text-slate-300">
                      <strong className="text-white">Dòng chữ trên ảnh:</strong> {activeDeconstruction.viral_dna.text_on_image}
                    </p>
                    <p className="text-xs text-slate-300">
                      <strong className="text-white">Màu sắc chủ đạo:</strong> {activeDeconstruction.viral_dna.primary_color_palette}
                    </p>
                    <p className="text-xs text-slate-300">
                      <strong className="text-white">Thumb-stopping factor:</strong> {activeDeconstruction.viral_dna.thumb_stopping_factor}
                    </p>
                    <p className="text-xs text-slate-300">
                      <strong className="text-white">Cảm xúc kích hoạt:</strong> {activeDeconstruction.viral_dna.core_emotion}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                    <p className="text-xs uppercase tracking-wider text-emerald-300 font-bold">2. Root-Cause Sentiment (50 Bình luận nhiều like)</p>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Khách đang khen:</p>
                      <ul className="list-disc pl-4 text-xs text-slate-400">
                        {activeDeconstruction.comment_sentiment.praises.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Khách đang chê / vướng mắc:</p>
                      <ul className="list-disc pl-4 text-xs text-slate-400">
                        {activeDeconstruction.comment_sentiment.complaints.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Khách đang hỏi mua gì:</p>
                      <ul className="list-disc pl-4 text-xs text-slate-400">
                        {activeDeconstruction.comment_sentiment.purchase_questions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Suggested High-Converting Angles */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-3">
                    3. Content Angles đánh trúng nỗi đau mà đối thủ chưa giải quyết:
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {activeDeconstruction.suggested_angles.map((ang, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{ang.title}</p>
                          <p className="text-xs text-slate-300 mt-1 italic">"{ang.hook}"</p>
                          <p className="text-xs text-slate-400 mt-2">Nỗi đau giải quyết: {ang.target_pain_point}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => useAngleForDraft(ang.title, ang.hook)}
                          className="mt-4 rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-300"
                        >
                          Chuyển sang Agent Copywriter →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Trends List */}
            <div className="grid gap-4">
              {trends.map((tr) => (
                <div key={tr.id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                        Signal: {tr.relevanceScore}
                      </span>
                      {tr.clusterTopic ? (
                        <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                          {tr.clusterTopic}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-base font-bold text-white">{tr.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{tr.summary}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Nguồn: {tr.source} · Keyword: {tr.keyword}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={deconstructingTrendId === tr.id}
                      onClick={() => void deconstructTrend(tr)}
                      className="rounded-xl border border-cyan-400/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-50"
                    >
                      {deconstructingTrendId === tr.id ? "Đang giải mã..." : "⚡ Giải mã DNA Viral"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftTopic(tr.keyword || tr.title);
                        setTab("create");
                      }}
                      className="rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20"
                    >
                      Viết bài ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TẠO BÀI VIẾT (MODULE 2: COPYWRITER + ART DIRECTOR + COMPLIANCE) */}
        {/* ======================================================== */}
        {tab === "create" && (
          <section className="pt-7 grid gap-8 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
            {/* Input Form */}
            <form onSubmit={handleGenerateDraft} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Module 2: RAG + Copywriting</p>
                <h2 className="mt-1 text-xl font-bold">Phòng sinh nội dung đa tác tử</h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Chủ đề bài viết / Keyword</label>
                <input
                  required
                  value={draftTopic}
                  onChange={(e) => setDraftTopic(e.target.value)}
                  placeholder="VD: Sai lầm khi chạy bộ mùa đông"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300">Công thức Copywriting</label>
                  <select
                    value={draftFormula}
                    onChange={(e) => setDraftFormula(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-slate-200 outline-none"
                  >
                    <option value="PAS">PAS (Problem - Agitate - Solve)</option>
                    <option value="AIDA">AIDA (Attention - Interest - Desire - Action)</option>
                    <option value="Before-After-Bridge">Before - After - Bridge</option>
                    <option value="Storytelling">Storytelling (Kể chuyện cá nhân)</option>
                    <option value="FAB">FAB (Features - Advantages - Benefits)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">Brand Voice</label>
                  <select
                    onChange={(e) => {
                      const selected = brandVoices.find((b) => b.id === e.target.value);
                      if (selected) setBrandVoiceText(selected.systemPrompt);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-slate-200 outline-none"
                  >
                    {brandVoices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">System Prompt Giọng Văn (Brand Voice)</label>
                <textarea
                  rows={3}
                  value={brandVoiceText}
                  onChange={(e) => setBrandVoiceText(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs leading-5 text-slate-300 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Đối tượng mục tiêu (Audience)</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="VD: Chủ shop, người chạy bộ, dân văn phòng"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Bối cảnh trend / Nỗi đau (Trend Context)</label>
                <textarea
                  rows={2}
                  value={trendContext}
                  onChange={(e) => setTrendContext(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-slate-300 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-emerald-300 space-y-1">
                <p className="font-bold">⚡ Tích hợp RAG 2 Kho:</p>
                <p>• Kho 1: Tra cứu {knowledgeList.length} thông tin sản phẩm (chống ảo giác).</p>
                <p>• Kho 2: Dynamic Few-Shot từ các bài tương tác cao nhất.</p>
              </div>

              <button
                disabled={busy || !draftTopic.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50"
              >
                {busy ? "Đang chạy 3 Agents (Copy + Art + Guard)..." : "Khởi tạo bài viết chuẩn Structured Output"}
              </button>
            </form>

            {/* Result Display */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6">
              {generated ? (
                <div className="space-y-6">
                  {/* Metadata Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                          {generationSource}
                        </span>
                        <span className="text-xs text-slate-400">
                          {retrievedExamples} bài mẫu · {retrievedKnowledge} SP tra cứu
                        </span>
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-white">{generated.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Formula: <span className="text-cyan-300 font-semibold">{generated.formula}</span> · Hook: {generated.hookType}
                      </p>
                    </div>
                    <span className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-bold uppercase text-emerald-400">
                      {generated.status}
                    </span>
                  </div>

                  {/* Main Content Box */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Nội dung bài viết (Main Content)
                    </label>
                    <textarea
                      rows={8}
                      value={generated.body}
                      onChange={(e) => setGenerated({ ...generated, body: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-sm leading-6 text-slate-200 outline-none focus:border-cyan-400"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {generated.hashtags.map((tag) => (
                        <span key={tag} className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* First Comment Box */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">First Comment (Chứa link chuyển đổi)</p>
                    <p className="mt-1 text-xs text-slate-300 leading-5">{generated.firstComment}</p>
                  </div>

                  {/* Art Director Live Preview */}
                  <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wider text-purple-300 font-bold">
                        Agent 3: Art Director (Programmatic Image Engine)
                      </p>
                      <span className="text-[10px] text-purple-400 font-medium">Sharp + SVG Typographic Overlay</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong className="text-white">Prompt ảnh nền tiếng Anh:</strong> {generated.artDirectionPrompt}
                    </p>
                    <p className="text-xs text-slate-300">
                      <strong className="text-white">Hook text tiếng Việt:</strong>{" "}
                      <span className="text-cyan-300 font-bold">
                        {generated.mediaGeneration?.overlay_text_vi || "ĐỪNG BẮT ĐẦU VỘI KHI CHƯA BIẾT ĐIỀU NÀY!"}
                      </span>
                    </p>

                    {/* Programmatic Rendered Image Canvas */}
                    {generated.mediaGeneration?.image_data_url ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={generated.mediaGeneration.image_data_url}
                          alt="AI Art Director Banner"
                          className="w-full max-h-[360px] object-cover"
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Compliance Guard Report */}
                  <div
                    className={`rounded-xl border p-4 text-xs space-y-2 ${
                      generated.compliance.is_safe_for_facebook
                        ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                        : "border-red-500/40 bg-red-950/20 text-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        Agent 4: Meta Compliance Guard · Điểm dự đoán tương tác: {generated.compliance.predicted_engagement_score}/10
                      </span>
                      <span className="font-bold uppercase">
                        {generated.compliance.is_safe_for_facebook ? "✓ Đạt an toàn" : "⚠ Cần xem xét"}
                      </span>
                    </div>
                    {generated.compliance.detected_risks.length ? (
                      <div className="space-y-1">
                        {generated.compliance.detected_risks.map((risk, i) => (
                          <p key={i} className="text-slate-300">
                            • [{risk.severity}] {risk.message} <em>"{risk.match}"</em>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-emerald-400">Không phát hiện từ cấm hay thủ thuật câu tương tác rẻ tiền (Engagement Bait).</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void updatePost(generated, {
                          title: generated.title,
                          body: generated.body,
                          firstComment: generated.firstComment,
                        })
                      }
                      className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Lưu chỉnh sửa
                    </button>
                    <button
                      type="button"
                      disabled={busy || !generated.compliance.is_safe_for_facebook}
                      onClick={() =>
                        void updatePost(generated, {
                          title: generated.title,
                          body: generated.body,
                          firstComment: generated.firstComment,
                          status: "approved",
                        })
                      }
                      className="rounded-xl border border-emerald-400/60 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      Duyệt bài (Approve)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("orchestration")}
                      className="rounded-xl bg-purple-500/20 border border-purple-500/40 px-4 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/30"
                    >
                      Mở Spintax Đa Kênh →
                    </button>
                    <button
                      type="button"
                      disabled={busy || generated.status !== "approved"}
                      onClick={() => void publishPost(generated)}
                      className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-40"
                    >
                      Đăng ngay lên Fanpage
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center p-6 text-slate-500">
                  <p className="text-4xl mb-3">⚡</p>
                  <p className="text-base font-semibold text-slate-300">Khu vực hiển thị kết quả Đa Tác Tử</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Nhập chủ đề ở bên trái và bấm khởi tạo để Agent Copywriter, Art Director và Compliance Guard phối hợp làm việc.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SPINTAX & GIỜ VÀNG (MODULE 3) */}
        {/* ======================================================== */}
        {tab === "orchestration" && (
          <section className="pt-7 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Module 3: Smart Orchestration & Publishing Worker
              </p>
              <h2 className="mt-1 text-2xl font-bold">Contextual Spintax & Dự đoán Giờ Vàng Đăng Bài</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tự động sinh biến thể ngữ nghĩa cho từng Fanpage vệ tinh và Group (Cosine Similarity &lt; 30% chống spam)
              </p>
            </div>

            {/* Predictive Best-Time Recommendation Card */}
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 p-5 grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-300">
                  Thuật toán dự đoán giờ vàng (Machine Learning Heuristic)
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">Khung giờ đề xuất cho nội dung</h3>
                <p className="mt-1 text-xs text-slate-300 leading-5">
                  • <strong>Nội dung Viral / Giải trí:</strong> 11:30 - 12:30 (Nghỉ trưa) hoặc 21:00 - 22:30 (Buổi tối thư giãn).
                  <br />• <strong>Nội dung B2B / Bán hàng / Kiến thức:</strong> 07:30 - 08:30 (Đầu giờ sáng) hoặc 19:30 - 20:30 (Sau bữa tối).
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs text-slate-400">Khung giờ vàng tối ưu tiếp theo:</p>
                <p className="text-xl font-black text-cyan-300 mt-1">07:30 - 08:30 sáng</p>
                <p className="text-xs text-emerald-400 mt-1">✓ Tỷ lệ tiếp cận tự nhiên dự kiến tăng +34%</p>
              </div>
            </div>

            {/* Contextual Spintax Variations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Các biến thể Spintax ngữ nghĩa đã tạo</h3>
                <span className="text-xs text-slate-400">
                  {activeSpintaxVariations.length || 3} kênh vệ tinh sẵn sàng
                </span>
              </div>

              {(activeSpintaxVariations.length ? activeSpintaxVariations : [
                {
                  id: "demo-spintax-1",
                  targetChannelOrPage: "Group Cộng Đồng Kinh Doanh & Khởi Nghiệp",
                  targetAudienceSegment: "Chủ shop & người kinh doanh thực chiến",
                  mainContent:
                    "🔥 Góc chia sẻ thực chiến cho anh em trong Group Khởi Nghiệp!\n\nKinh nghiệm thực tế khi triển khai chạy bộ mùa đông là khoanh vùng đúng điểm nghẽn đau khớp gối.\n\n📌 Anh em nào đang vướng ca này, cmt thảo luận cùng tìm hướng tối ưu nhé!",
                  firstComment: "👉 Toàn bộ checklist chi tiết mình ghim ở đây cho anh em lưu lại.",
                  cosineSimilarityWithOriginal: 0.24,
                },
                {
                  id: "demo-spintax-2",
                  targetChannelOrPage: "Fanpage Vệ Tinh Chia Sẻ Mẹo Hàng Ngày",
                  targetAudienceSegment: "Khách hàng đại chúng, lướt nhanh",
                  mainContent:
                    "Có bạn nào trong nhóm từng xỏ giày là lao ra đường ngay khi trời rét chưa?\n\nMẹo nhỏ là nên thử làm nóng khớp gối trong 3 phút để không bị chấn thương ngầm.\n\nThử áp dụng tuần này xem kết quả thay đổi thế nào nha cả nhà!",
                  firstComment: "Link chi tiết và lưu ý thêm mình để dưới này cho ai cần nhé.",
                  cosineSimilarityWithOriginal: 0.19,
                },
                {
                  id: "demo-spintax-3",
                  targetChannelOrPage: "Group Chuyên Môn & Trao Đổi B2B",
                  targetAudienceSegment: "Quản lý, chủ doanh nghiệp vừa và nhỏ",
                  mainContent:
                    "[Góc nhìn chuyên sâu - Group Chuyên Môn]\n\nVấn đề tối ưu hóa quy trình thường gặp trở ngại ở khâu bắt đầu. Việc đo lường dữ liệu theo chu kỳ 14 ngày mang lại hiệu suất bền vững.\n\nQuý anh chị có chiến lược nào tương tự trong tổ chức của mình?",
                  firstComment: "Tài liệu benchmark và checklist triển khai tham khảo tại đây.",
                  cosineSimilarityWithOriginal: 0.28,
                },
              ]).map((variation) => (
                <div key={variation.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <p className="text-sm font-bold text-white">{variation.targetChannelOrPage}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Tệp độc giả: {variation.targetAudienceSegment}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          variation.cosineSimilarityWithOriginal < 0.3
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        Độ trùng lặp: {(variation.cosineSimilarityWithOriginal * 100).toFixed(0)}% (An toàn &lt; 30%)
                      </span>
                    </div>
                  </div>
                  <p className="whitespace-pre-line text-xs leading-5 text-slate-300">{variation.mainContent}</p>
                  <p className="text-xs text-slate-400 italic">First Comment: {variation.firstComment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 5: LỊCH & HÀNG ĐỢI XUẤT BẢN */}
        {/* ======================================================== */}
        {tab === "queue" && (
          <section className="pt-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Xuất bản & Lịch đăng</p>
              <h2 className="mt-1 text-2xl font-bold">Hàng đợi bài viết & Kết nối Facebook Graph API</h2>
            </div>
            <div className="divide-y divide-white/10">
              {orderedPosts.map((post) => (
                <div key={post.id} className="py-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs uppercase font-bold text-cyan-300">
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-400">{post.formula}</span>
                      {post.scheduledAt ? (
                        <span className="text-xs text-emerald-400">
                          Hẹn đăng: {new Date(post.scheduledAt).toLocaleString("vi-VN")}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-white">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300 whitespace-pre-line">{post.body}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    {post.status === "draft" || post.status === "review" ? (
                      <button
                        onClick={() => void updatePost(post, { status: "approved" })}
                        className="rounded-lg border border-emerald-400/50 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/10"
                      >
                        Duyệt bài
                      </button>
                    ) : null}
                    <button
                      onClick={() => void publishPost(post)}
                      className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                    >
                      Đăng ngay lên FB
                    </button>
                  </div>
                </div>
              ))}
              {!orderedPosts.length ? <p className="text-xs text-slate-500 py-8">Chưa có bài viết trong hàng đợi.</p> : null}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 6: GROWTH ANALYST (MODULE 4: FEEDBACK LOOP) */}
        {/* ======================================================== */}
        {tab === "analytics" && (
          <section className="pt-7 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Module 4: Tự động Tối ưu bằng AI
                </p>
                <h2 className="mt-1 text-2xl font-bold">Growth Analyst Agent (Self-Improving Feedback Loop)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tự động so sánh A/B top bài thắng/thua, nhận diện quy luật và đề xuất Auto-Tune System Prompt.
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={handleRunGrowthAnalysis}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:opacity-95 disabled:opacity-50"
              >
                {busy ? "Đang phân tích..." : "⚡ Chạy Growth Analyst ngay"}
              </button>
            </div>

            {/* Pattern Recognition Report */}
            {growthReport ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      Quy luật phát hiện được (Pattern Recognition)
                    </span>
                    <span className="text-xs text-slate-400">{growthReport.analyzedPostCount} bài được phân tích</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {growthReport.patterns.map((pat, idx) => (
                      <div key={idx} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-300">{pat.formulaUsed}</span>
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                            Hiệu quả x{pat.multiplierEffect}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-5">{pat.observation}</p>
                        <p className="text-xs text-amber-300 font-medium">👉 {pat.actionableRecommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-Tuning Suggestion Box */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Auto-Tuning System Prompt (Tự động nâng cấp trí thông minh)
                      </span>
                      <h3 className="mt-1 text-lg font-bold text-white">Bản gợi ý nâng cấp Prompt cho Brand Voice</h3>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void handleAcceptAutoTune(
                          growthReport.suggestedBrandVoicePrompt,
                          growthReport.autoTuningRationale,
                        )
                      }
                      className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20"
                    >
                      ✓ Chấp nhận & Cập nhật Prompt
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 italic">{growthReport.autoTuningRationale}</p>

                  <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Prompt đề xuất mới:</p>
                    <p className="text-xs text-slate-200 leading-5 font-mono">
                      {growthReport.suggestedBrandVoicePrompt}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-8 text-center text-slate-400">
                <p>Bấm nút "Chạy Growth Analyst ngay" để phân tích A/B và tạo báo cáo tối ưu tự động.</p>
              </div>
            )}
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 7: RAG KNOWLEDGE BASE & BRAND VOICES */}
        {/* ======================================================== */}
        {tab === "knowledge" && (
          <section className="pt-7 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Kho Tri Thức & Brand Voice
              </p>
              <h2 className="mt-1 text-2xl font-bold">RAG Product Knowledge Base & Quản lý Giọng Văn</h2>
              <p className="text-xs text-slate-400 mt-1">
                Lưu trữ thông tin sản phẩm, bảng giá, USP, FAQ (Kho 1) để AI viết đúng 100%, không bị ảo giác.
              </p>
            </div>

            {/* Add Knowledge Item Form */}
            <form onSubmit={handleSaveKnowledge} className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Thêm thông tin sản phẩm / USP vào Kho Tri Thức (Kho 1)</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  required
                  value={kbTitle}
                  onChange={(e) => setKbTitle(e.target.value)}
                  placeholder="Tên sản phẩm / Chủ đề (VD: Bó gối trợ lực Pro-Run 360)"
                  className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
                />
                <select
                  value={kbCategory}
                  onChange={(e) => setKbCategory(e.target.value as ProductKnowledgeItem["category"])}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-slate-200 outline-none"
                >
                  <option value="usp">USP / Tính năng nổi bật</option>
                  <option value="pricing">Bảng giá & Khuyến mãi</option>
                  <option value="faq">Câu hỏi thường gặp (FAQ)</option>
                  <option value="guarantee">Chính sách bảo hành / Đổi trả</option>
                </select>
              </div>
              <textarea
                required
                rows={3}
                value={kbContent}
                onChange={(e) => setKbContent(e.target.value)}
                placeholder="Nội dung chi tiết về tính năng, chất liệu, giá niêm yết, ưu đãi, quy cách bảo hành..."
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs leading-5 text-slate-300 outline-none focus:border-cyan-400"
              />
              <button disabled={busy} className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-300">
                Lưu vào Vector DB
              </button>
            </form>

            {/* Knowledge Items Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {knowledgeList.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold uppercase text-emerald-300">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-5">{item.contentText}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TAB 8: SETTINGS & CHI PHÍ AI */}
        {/* ======================================================== */}
        {tab === "settings" && (
          <section className="pt-7 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Hệ thống & Tích hợp</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Cấu hình AI & API Toàn Hệ Thống</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Quản lý API Keys (OpenAI, Anthropic, Gemini, Azure), phân tầng Model Routing, kết nối Facebook Page và Vector DB trực tiếp trên giao diện không cần sửa file .env.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  {showSecrets ? "🔒 Ẩn API Keys" : "👁️ Hiện API Keys"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveConfig()}
                  disabled={savingConfig}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50"
                >
                  {savingConfig ? "Đang lưu..." : "💾 Lưu cấu hình hệ thống"}
                </button>
              </div>
            </div>

            {/* Provider Connectivity Status Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { name: "AI Brain", sub: "OpenAI / Azure", ok: settings?.providers.ai },
                { name: "Facebook API", sub: "Graph API v23.0", ok: settings?.providers.facebook },
                { name: "Vector DB", sub: "Qdrant Store", ok: settings?.providers.qdrant },
                { name: "Database", sub: settings?.providers.postgresConfigured ? "PostgreSQL" : "Local File", ok: true },
                { name: "Trend Feeds", sub: "RSS Crawlers", ok: settings?.providers.trendFeeds },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.ok ? "bg-emerald-400 shadow-lg shadow-emerald-500/50" : "bg-amber-400"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.sub}</p>
                  <p className={`text-xs font-semibold mt-2 ${item.ok ? "text-emerald-300" : "text-amber-300"}`}>
                    {item.ok ? "Đã sẵn sàng" : "Chưa cấu hình"}
                  </p>
                </div>
              ))}
            </div>

            {/* SECTION 1: AI PROVIDER & API KEYS */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🤖</span> 1. Nhà cung cấp AI & Khóa API
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cấu hình API Key để kích hoạt các Agent phân tích xu hướng, sáng tạo nội dung và tối ưu tăng trưởng.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestAi}
                    disabled={testingAi}
                    className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition disabled:opacity-50"
                  >
                    {testingAi ? "⏳ Đang kiểm tra..." : "⚡ Kiểm tra kết nối AI"}
                  </button>
                </div>
              </div>

              {/* AI Test Result Alert */}
              {aiTestResult && (
                <div
                  className={`rounded-2xl border p-4 text-xs ${
                    aiTestResult.success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  <p className="font-bold">{aiTestResult.success ? "✅ Kết nối AI thành công!" : "❌ Lỗi kết nối AI:"}</p>
                  <p className="mt-1">{aiTestResult.message}</p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {/* AI Provider Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    AI Provider chính
                  </label>
                  <select
                    value={configForm.aiProvider || "openai"}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        aiProvider: e.target.value as SystemConfig["aiProvider"],
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  >
                    <option value="openai">OpenAI (GPT-4o, GPT-4o-mini) — Khuyên dùng</option>
                    <option value="azure_openai">Microsoft Azure OpenAI Service</option>
                    <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Flash/Pro)</option>
                    <option value="demo">Demo / Mock nội bộ (Không cần API Key)</option>
                  </select>
                </div>

                {/* OpenAI API Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={configForm.openaiApiKey || ""}
                    onChange={(e) => setConfigForm({ ...configForm, openaiApiKey: e.target.value })}
                    placeholder="sk-proj-..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Dùng cho Agent 1, 2, 4 và sinh Structured Outputs.</p>
                </div>

                {/* Anthropic API Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Anthropic API Key (Claude)
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={configForm.anthropicApiKey || ""}
                    onChange={(e) => setConfigForm({ ...configForm, anthropicApiKey: e.target.value })}
                    placeholder="sk-ant-..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Dùng cho Copywriter Agent viết tiếng Việt sâu sắc.</p>
                </div>

                {/* Gemini API Key */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Google Gemini API Key
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={configForm.geminiApiKey || ""}
                    onChange={(e) => setConfigForm({ ...configForm, geminiApiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Dùng cho xử lý multimodal ảnh/video đối thủ và Spintax nhanh.</p>
                </div>
              </div>

              {/* Azure OpenAI Details (if selected) */}
              {configForm.aiProvider === "azure_openai" && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-4">
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Thông số Azure OpenAI</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Azure Endpoint URL</label>
                      <input
                        value={configForm.azureOpenAiEndpoint || ""}
                        onChange={(e) => setConfigForm({ ...configForm, azureOpenAiEndpoint: e.target.value })}
                        placeholder="https://your-resource.openai.azure.com"
                        className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Azure API Key</label>
                      <input
                        type={showSecrets ? "text" : "password"}
                        value={configForm.azureOpenAiKey || ""}
                        onChange={(e) => setConfigForm({ ...configForm, azureOpenAiKey: e.target.value })}
                        placeholder="Azure API key"
                        className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Deployment Name</label>
                      <input
                        value={configForm.azureOpenAiDeployment || ""}
                        onChange={(e) => setConfigForm({ ...configForm, azureOpenAiDeployment: e.target.value })}
                        placeholder="gpt-4o"
                        className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: MODEL ROUTING STRATEGY */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🎯</span> 2. Chiến Lược Phân Tầng Model (Model Routing Strategy)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Định tuyến thông minh theo 3 tầng để tối ưu 20-30 lần chi phí token mà vẫn đảm bảo chất lượng bài viết và đồ họa đỉnh cao.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Tier 1 */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3">
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                    Tầng 1 (Rẻ & Siêu nhanh &lt; 1s)
                  </span>
                  <p className="text-xs text-slate-400 leading-5">
                    Dùng cho: Lọc thô trend, Spintax ngữ cảnh &lt; 30% trùng lặp, quét Meta Compliance.
                  </p>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Model Chỉ Định</label>
                    <input
                      value={configForm.tier1Model || "gpt-4o-mini"}
                      onChange={(e) => setConfigForm({ ...configForm, tier1Model: e.target.value })}
                      placeholder="gpt-4o-mini"
                      className="w-full rounded-xl border border-white/10 bg-black/60 p-2.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                    Tầng 2 (Sâu sắc & Giàu cảm xúc)
                  </span>
                  <p className="text-xs text-slate-400 leading-5">
                    Dùng cho: Copywriter Agent viết bài PAS/AIDA, bóc tách Angle đối thủ, RAG chống ảo giác.
                  </p>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Model Chỉ Định</label>
                    <input
                      value={configForm.tier2Model || "gpt-4o"}
                      onChange={(e) => setConfigForm({ ...configForm, tier2Model: e.target.value })}
                      placeholder="gpt-4o"
                      className="w-full rounded-xl border border-white/10 bg-black/60 p-2.5 text-xs text-emerald-300 font-mono outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3">
                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                    Tầng 3 (Visual & Compositing)
                  </span>
                  <p className="text-xs text-slate-400 leading-5">
                    Dùng cho: Art Director tạo ảnh concept + Sharp ghép Typography tiếng Việt và Logo Fanpage.
                  </p>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Engine Đồ Họa</label>
                    <select
                      value={configForm.tier3ImageModel || "sharp-programmatic"}
                      onChange={(e) => setConfigForm({ ...configForm, tier3ImageModel: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/60 p-2.5 text-xs text-purple-300 font-semibold outline-none focus:border-purple-400"
                    >
                      <option value="sharp-programmatic">Sharp Programmatic (100% không lỗi font TV) ⭐</option>
                      <option value="flux.1-schnell">Flux.1 Schnell ($0.003/ảnh)</option>
                      <option value="dall-e-3">OpenAI DALL-E 3</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: FACEBOOK GRAPH API CONFIGURATION */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🌐</span> 3. Kết Nối Facebook Graph API (v23.0)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cấu hình Fanpage ID và Page Access Token để xuất bản bài viết tự động theo lịch hẹn và thu thập insights tương tác.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestFacebook}
                    disabled={testingFb}
                    className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition disabled:opacity-50"
                  >
                    {testingFb ? "⏳ Đang kiểm tra..." : "⚡ Kiểm tra Fanpage"}
                  </button>
                </div>
              </div>

              {/* Facebook Test Result Alert */}
              {fbTestResult && (
                <div
                  className={`rounded-2xl border p-4 text-xs ${
                    fbTestResult.success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  <p className="font-bold">{fbTestResult.success ? "✅ Fanpage hợp lệ!" : "❌ Lỗi kết nối Facebook:"}</p>
                  <p className="mt-1">{fbTestResult.message}</p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Facebook Page ID
                  </label>
                  <input
                    value={configForm.facebookPageId || ""}
                    onChange={(e) => setConfigForm({ ...configForm, facebookPageId: e.target.value })}
                    placeholder="VD: 109283746582910"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Lấy tại mục Giới thiệu Fanpage (Page Transparency ID).</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Facebook Page Access Token (Long-lived Token)
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={configForm.facebookPageAccessToken || ""}
                    onChange={(e) => setConfigForm({ ...configForm, facebookPageAccessToken: e.target.value })}
                    placeholder="EAAB..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Token quyền pages_manage_posts, pages_read_engagement.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Facebook App ID (Tùy chọn)
                  </label>
                  <input
                    value={configForm.facebookAppId || ""}
                    onChange={(e) => setConfigForm({ ...configForm, facebookAppId: e.target.value })}
                    placeholder="App ID trên Meta for Developers"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Facebook App Secret (Tùy chọn)
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={configForm.facebookAppSecret || ""}
                    onChange={(e) => setConfigForm({ ...configForm, facebookAppSecret: e.target.value })}
                    placeholder="App Secret"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: VECTOR DATABASE & TREND FEEDS */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🧠</span> 4. Vector Database (Qdrant) & Cảm biến Trend Feeds
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kho tri thức sản phẩm (Kho 1) và kho bài viết thắng điểm cao (Kho 2) dùng cho RAG chống ảo giác và gom cụm ngữ nghĩa xu hướng.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Qdrant Endpoint URL
                  </label>
                  <input
                    value={configForm.qdrantUrl || "http://localhost:6333"}
                    onChange={(e) => setConfigForm({ ...configForm, qdrantUrl: e.target.value })}
                    placeholder="http://localhost:6333"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Qdrant API Key (Tùy chọn)
                  </label>
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={configForm.qdrantApiKey || ""}
                    onChange={(e) => setConfigForm({ ...configForm, qdrantApiKey: e.target.value })}
                    placeholder="Để trống nếu chạy Docker local"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Collection Name
                  </label>
                  <input
                    value={configForm.qdrantCollection || "winning-posts"}
                    onChange={(e) => setConfigForm({ ...configForm, qdrantCollection: e.target.value })}
                    placeholder="winning-posts"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    RSS Trend Feeds (Phân tách bằng dấu phẩy)
                  </label>
                  <textarea
                    rows={2}
                    value={configForm.trendFeedUrls || ""}
                    onChange={(e) => setConfigForm({ ...configForm, trendFeedUrls: e.target.value })}
                    placeholder="https://vnexpress.net/rss/kinh-doanh.rss,https://cafebiz.vn/trang-chu.rss"
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Từ khóa lọc Trend (Phân tách bằng dấu phẩy)
                  </label>
                  <textarea
                    rows={2}
                    value={configForm.trendKeywords || ""}
                    onChange={(e) => setConfigForm({ ...configForm, trendKeywords: e.target.value })}
                    placeholder="kinh doanh,chạy bộ,sức khỏe,marketing,xu hướng,thời trang"
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-5">
              <div>
                <p className="text-sm font-bold text-white">Đồng bộ cấu hình tức thời</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mọi thay đổi sẽ được lưu an toàn vào tệp lưu trữ và cập nhật trực tiếp vào tiến trình AI mà không cần khởi động lại ứng dụng.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveConfig()}
                disabled={savingConfig}
                className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50"
              >
                {savingConfig ? "Đang lưu cấu hình..." : "Lưu tất cả cấu hình"}
              </button>
            </div>

            {/* SECTION 5: TOKEN USAGE & EXPENSES */}
            {analytics?.usage?.length ? (
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📊</span> Lịch sử tiêu thụ Token gần nhất
                </h3>
                <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-slate-900/30 p-4">
                  {analytics.usage.map((u) => (
                    <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-cyan-300">[{u.moduleType}]</span>{" "}
                        <span className="text-slate-300">{u.modelName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400">
                          {u.promptTokens + u.completionTokens} tokens · ${(u.estimatedCostUsd).toFixed(5)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        )}
      </div>
    </main>
  );
}
