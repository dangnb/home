const agents = [
  {
    step: "Agent 1",
    title: "Trend Scout Agent",
    subtitle: "Chuyên gia giải mã Viral",
    description: "Multimodal Vision LLM đọc cả ảnh/video & text đối thủ. Bóc tách 'DNA Viral' và phân tích bình luận (khen/chê/hỏi mua gì) để tìm ra Content Angle đánh trúng nỗi đau.",
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-400/30 text-cyan-300",
  },
  {
    step: "Agent 2",
    title: "Copywriter Agent + RAG",
    subtitle: "Chuyên gia viết bài theo Brand Voice",
    description: "Tích hợp RAG 2 kho: Kho 1 (Thông tin SP/USP/Bảng giá chống ảo giác) và Kho 2 (Top 50 bài tương tác cao nhất). Áp dụng các công thức PAS, AIDA, Before-After-Bridge.",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-300",
  },
  {
    step: "Agent 3",
    title: "Art Director Agent",
    subtitle: "Giám đốc hình ảnh & Programmatic Image",
    description: "Sinh prompt tạo concept ảnh nền không chữ (Flux/DALL-E) + Thư viện Sharp backend tự động ghép Hook Text chuẩn font tiếng Việt và đóng dấu Logo Fanpage lên ảnh.",
    color: "from-purple-500/20 to-pink-500/10 border-purple-400/30 text-purple-300",
  },
  {
    step: "Agent 4",
    title: "Meta Compliance Guard",
    subtitle: "Kiểm duyệt viên AI & Chống bóp Reach",
    description: "Quét chính sách Facebook: tự động viết lại câu Engagement Bait thành câu thảo luận mở tự nhiên, quét từ cấm Y tế/Tài chính/Cam kết 100%, chấm điểm an toàn trước khi đăng.",
    color: "from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-300",
  },
  {
    step: "Agent 5",
    title: "Growth Analyst Agent",
    subtitle: "Chuyên gia tối ưu & Auto-Tuning",
    description: "So sánh A/B tuần giữa 10 bài thắng vs 10 bài thua. Nhận diện quy luật nội dung và tự động đề xuất cập nhật System Prompt trong bảng BrandVoices và đẩy vào Vector DB.",
    color: "from-blue-500/20 to-indigo-500/10 border-blue-400/30 text-blue-300",
  },
];

const modules = [
  {
    num: "Module 1",
    name: "Trend Intelligence",
    features: [
      "Semantic Clustering: Gom cụm từ khóa cùng sự kiện bằng Embedding",
      "Multimodal Viral Deconstruction: Đọc text trên ảnh & thumb-stopping factor",
      "Root-Cause Sentiment: Quét 50 bình luận nhiều like nhất để bóc tách nhu cầu",
    ],
  },
  {
    num: "Module 2",
    name: "RAG + Multi-Step Prompting",
    features: [
      "Kho 1: Product Knowledge Base (USP, bảng giá, FAQ, tính năng)",
      "Kho 2: Few-Shot Winning Posts (Top 50 bài tương tác cao nhất)",
      "Programmatic Image: Sharp backend ghép Hook tiếng Việt 100% không lỗi font",
      "AI Meta-Policy Guardrail: Tự động sửa câu bait và quét vi phạm chính sách",
    ],
  },
  {
    num: "Module 3",
    name: "Smart Orchestration & Scheduling",
    features: [
      "Contextual Spintax: Viết lại cho từng Page vệ tinh, Cosine Similarity < 30%",
      "Predictive Best-Time-To-Post: Dự đoán giờ vàng (Viral: 11h30/21h00 vs B2B: 07h30/19h30)",
      "Xuất bản tự động qua Facebook Graph API có kiểm duyệt",
    ],
  },
  {
    num: "Module 4",
    name: "Self-Improving Feedback Loop",
    features: [
      "So sánh A/B tự động: Top 10 bài cao nhất vs 10 bài thấp nhất trong tuần",
      "Pattern Recognition: Nhận diện quy luật mở đầu số liệu, PAS x3.2 CTR First Comment",
      "Auto-Tuning: Tự động nâng cấp System Prompt của Brand Voice",
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#06090e] text-slate-100">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              AI
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-white">DangBaiTuDong AI</p>
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-cyan-400">
                Phòng Marketing Đa Tác Tử
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-xs font-semibold text-slate-300 md:flex">
            <a href="#agents" className="hover:text-cyan-300 transition">5 AI Agents</a>
            <a href="#modules" className="hover:text-cyan-300 transition">4 Modules</a>
            <a href="#architecture" className="hover:text-cyan-300 transition">Kiến trúc kỹ thuật</a>
          </div>

          <a
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
          >
            Vào Studio Dashboard →
          </a>
        </nav>

        {/* Hero Section */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Autonomous Multi-Agent Architecture
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white">
              Phòng Marketing Ảo gồm <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">5 AI Agents</span> tự động hóa Facebook.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              Thay vì các hàm xử lý cứng nhắc, hệ thống kết nối 5 tác tử chuyên biệt: Giải mã Viral, RAG kiến thức sản phẩm, Programmatic Image tiếng Việt, Kiểm duyệt chính sách Meta và Tự tối ưu Feedback Loop.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/25 hover:opacity-95 transition"
              >
                Mở Studio Dashboard
              </a>
              <a
                href="/api/health"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                Kiểm tra API Health
              </a>
            </div>
          </div>

          {/* Architecture Preview Widget */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                Multi-Agent Workflow Live
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                Active 5/5 Agents
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { name: "1. Trend Scout", role: "Đọc ảnh/video & 50 bình luận đối thủ", score: "94 Signal" },
                { name: "2. Copywriter + RAG", role: "Tra cứu 2 kho: SP + Bài cũ điểm cao", score: "PAS Formula" },
                { name: "3. Art Director", role: "Sharp backend ghép Hook tiếng Việt + Logo", score: "No Font Error" },
                { name: "4. Compliance Guard", role: "Chống bóp Reach, sửa câu bait & từ cấm", score: "Safe 9.2/10" },
                { name: "5. Growth Analyst", role: "So sánh A/B tuần & Auto-Tune System Prompt", score: "Auto-Tuning" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-black/40 p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.role}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-cyan-300 rounded bg-cyan-500/10 px-2 py-1">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 5 AGENTS */}
      <section id="agents" className="mx-auto max-w-7xl px-6 py-16 border-t border-white/10">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Multi-Agent System</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Chi tiết 5 AI Agents chuyên biệt</h2>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            Mỗi Agent đảm nhiệm một khâu then chốt trong chuỗi giá trị Marketing, giao tiếp qua Structured Outputs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.title}
              className={`rounded-2xl border bg-gradient-to-b p-6 backdrop-blur-sm flex flex-col justify-between ${agent.color}`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  {agent.step}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">{agent.title}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-300">{agent.subtitle}</p>
                <p className="mt-4 text-xs leading-6 text-slate-400">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: 4 MODULES */}
      <section id="modules" className="mx-auto max-w-7xl px-6 py-16 border-t border-white/10">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Core Architecture</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">4 Module nghiệp vụ cốt lõi</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((mod) => (
            <div key={mod.num} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase text-cyan-400">{mod.num}</span>
                <h3 className="text-lg font-bold text-white">{mod.name}</h3>
              </div>
              <ul className="space-y-2">
                {mod.features.map((feat, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-5">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: TECHNICAL STACK & ROUTING */}
      <section id="architecture" className="mx-auto max-w-7xl px-6 py-16 border-t border-white/10">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Engineering</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Chiến lược Tối ưu Chi phí (Model Routing)</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">Tầng 1 (Rẻ & Siêu nhanh)</span>
            <h3 className="mt-3 text-lg font-bold text-white">Lọc thô, Spintax, Compliance</h3>
            <p className="mt-2 text-xs text-slate-400 leading-5">
              GPT-4o-mini hoặc Gemini 1.5 Flash. Tốc độ dưới 1s, chi phí rẻ hơn 20-30 lần, chuyên phân tích cảm xúc và kiểm tra từ cấm.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">Tầng 2 (Sâu sắc & Giàu cảm xúc)</span>
            <h3 className="mt-3 text-lg font-bold text-white">Copywriting & Angle Strategy</h3>
            <p className="mt-2 text-xs text-slate-400 leading-5">
              Claude 3.5 Sonnet hoặc GPT-4o. Viết tiếng Việt tự nhiên, không sáo rỗng, áp dụng công thức PAS/Storytelling và RAG kiến thức sản phẩm.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">Tầng 3 (Visual & Compositing)</span>
            <h3 className="mt-3 text-lg font-bold text-white">Flux.1 + Sharp Programmatic</h3>
            <p className="mt-2 text-xs text-slate-400 leading-5">
              AI sinh ảnh concept không chữ ($0.003/ảnh) + Thư viện Sharp backend tự động ghép Hook Text tiếng Việt và đóng dấu Logo Fanpage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p>DangBaiTuDong AI Platform · Kiến trúc 5 AI Agents đa tác tử xuyên suốt 4 Module</p>
      </footer>
    </main>
  );
}
