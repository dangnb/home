import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import type {
  BrandVoice,
  GrowthReport,
  MarketingPost,
  MarketingTrend,
  ProductKnowledgeItem,
  TokenUsage,
  WinningPostEmbedding,
} from "@/lib/types";

export type {
  BrandVoice,
  GrowthReport,
  MarketingPost,
  MarketingTrend,
  ProductKnowledgeItem,
  TokenUsage,
  WinningPostEmbedding,
};
export type PostStatus = MarketingPost["status"];

type StoreState = {
  posts: MarketingPost[];
  trends: MarketingTrend[];
  usage: TokenUsage[];
  productKnowledge: ProductKnowledgeItem[];
  brandVoices: BrandVoice[];
  winningEmbeddings: WinningPostEmbedding[];
  growthReports: GrowthReport[];
};

const storePath = path.join(process.cwd(), "data", "marketing-store.json");
const globalStore = globalThis as typeof globalThis & { marketingPool?: Pool; marketingSchema?: Promise<void> };
const pool = process.env.DATABASE_URL
  ? (globalStore.marketingPool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5 }))
  : null;
let fileQueue = Promise.resolve();
let databaseWarningLogged = false;

const initialProductKnowledge: ProductKnowledgeItem[] = [
  {
    id: "kb-prod-1",
    workspaceId: "default-workspace",
    title: "Bó gối thể thao trợ lực khớp Pro-Run 360",
    category: "usp",
    contentText:
      "USP: Đệm silicon tổ ong bảo vệ bánh chè giảm 40% lực phản chấn, vải dệt 3D thoáng khí không bí mồ hôi. Giá niêm yết: 390.000đ/đôi, ưu đãi mùa đông giảm 30% còn 279.000đ. Bảo hành 1 đổi 1 trong 30 ngày nếu lỗi chỉ.",
    tags: ["bó gối", "chạy bộ", "thể thao", "khớp gối", "ưu đãi 30%"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "kb-prod-2",
    workspaceId: "default-workspace",
    title: "Chính sách đổi trả & cam kết chất lượng",
    category: "guarantee",
    contentText:
      "Cam kết đổi size miễn phí tận nhà trong 7 ngày nếu không vừa. Kiểm tra hàng trước khi thanh toán. Không bán hàng nhái, sản phẩm đạt chứng nhận an toàn cho da nhạy cảm.",
    tags: ["chính sách", "đổi trả", "kiểm tra hàng"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialBrandVoices: BrandVoice[] = [
  {
    id: "bv-default",
    workspaceId: "default-workspace",
    name: "Chuyên gia Thể thao Thực chiến",
    systemPrompt:
      "Bạn là một vận động viên phong trào có 6 năm kinh nghiệm chạy marathon và tư vấn phụ kiện chạy bộ. Giọng văn chân thành, xưng 'mình' hoặc 'anh em', nói thẳng vào vấn đề đau khớp gối của người mới, dùng ví dụ cụ thể, không bao giờ dùng từ sáo rỗng hoặc câu like rẻ tiền.",
    tone: "Thực tế, gần gũi, chuyên môn cao nhưng giải thích dễ hiểu",
    targetAudience: "Người chạy bộ sáng sớm, dân văn phòng tập cardio, độ tuổi 25-45",
    preferredFormulas: ["PAS", "Before-After-Bridge", "Storytelling"],
    autoTuningHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: StoreState = {
  posts: [],
  trends: [
    {
      id: "trend-demo-1",
      title: "Chạy bộ sáng sớm mùa đông: Cách giữ ấm và bảo vệ khớp gối",
      keyword: "chạy bộ mùa đông",
      source: "Facebook Running Community",
      summary:
        "Bài viết đối thủ đạt 3.8K like và 420 share nhờ đánh vào nỗi sợ đau khớp gối khi trời dưới 15 độ. Bình luận chủ yếu hỏi về động tác khởi động và loại bó gối trợ lực.",
      relevanceScore: 94,
      clusterTopic: "Thể thao & Sức khỏe mùa lạnh",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "trend-demo-2",
      title: "Sai lầm khi xỏ giày chạy ngay không qua 5 phút khởi động",
      keyword: "khởi động chạy bộ",
      source: "Tiktok Fitness Viral",
      summary:
        "Video ngắn 45s chỉ ra 3 động tác giãn cơ động giúp làm nóng dịch khớp. Tỷ lệ giữ chân người xem cao nhờ hook cảnh báo chấn thương ngay giây thứ 2.",
      relevanceScore: 88,
      clusterTopic: "Kỹ thuật chạy an toàn",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "trend-demo-3",
      title: "Review so sánh đồ bảo hộ khớp: Bó gối silicon vs Băng quấn co giãn",
      keyword: "so sánh phụ kiện chạy bộ",
      source: "Group Yêu Chạy Bộ 150k members",
      summary:
        "Thảo luận sôi nổi về ưu nhược điểm của bó gối có đệm bảo vệ bánh chè so với băng quấn thun thông thường.",
      relevanceScore: 82,
      clusterTopic: "Đồ tập & Trang bị",
      discoveredAt: new Date().toISOString(),
    },
  ],
  usage: [],
  productKnowledge: initialProductKnowledge,
  brandVoices: initialBrandVoices,
  winningEmbeddings: [],
  growthReports: [],
};

async function ensureSchema() {
  if (!pool) return;
  globalStore.marketingSchema ??= pool
    .query(`
      CREATE TABLE IF NOT EXISTS marketing_posts (
        id text PRIMARY KEY,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS marketing_trends (
        id text PRIMARY KEY,
        data jsonb NOT NULL,
        discovered_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS ai_token_usage (
        id text PRIMARY KEY,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS product_knowledge (
        id text PRIMARY KEY,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS brand_voices (
        id text PRIMARY KEY,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS growth_reports (
        id text PRIMARY KEY,
        data jsonb NOT NULL,
        created_at timestamptz NOT NULL
      );
    `)
    .then(() => undefined);
  await globalStore.marketingSchema;
}

async function readFileState(): Promise<StoreState> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      posts: parsed.posts ?? [],
      trends: parsed.trends ?? initialState.trends,
      usage: parsed.usage ?? [],
      productKnowledge: parsed.productKnowledge?.length ? parsed.productKnowledge : initialProductKnowledge,
      brandVoices: parsed.brandVoices?.length ? parsed.brandVoices : initialBrandVoices,
      winningEmbeddings: parsed.winningEmbeddings ?? [],
      growthReports: parsed.growthReports ?? [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return structuredClone(initialState);
  }
}

async function writeFileState(state: StoreState) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const temporaryPath = `${storePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(state, null, 2), "utf8");
  await rename(temporaryPath, storePath);
}

async function withFileState<T>(operation: (state: StoreState) => T | Promise<T>, write: boolean) {
  const pending = fileQueue.then(async () => {
    const state = await readFileState();
    const result = await operation(state);
    if (write) await writeFileState(state);
    return result;
  });
  fileQueue = pending.then(() => undefined, () => undefined);
  return pending;
}

async function withDatabase<T>(operation: (client: Pool) => Promise<T>): Promise<T | null> {
  if (!pool) return null;
  try {
    await ensureSchema();
    return await operation(pool);
  } catch (error) {
    globalStore.marketingSchema = undefined;
    if (!databaseWarningLogged) {
      console.warn("PostgreSQL unavailable; using the local marketing store.", error);
      databaseWarningLogged = true;
    }
    return null;
  }
}

export async function listPosts(): Promise<MarketingPost[]> {
  const rows = await withDatabase(async (client) =>
    (await client.query<{ data: MarketingPost }>("SELECT data FROM marketing_posts ORDER BY created_at DESC")).rows.map(
      (row) => row.data,
    ),
  );
  return (
    rows ??
    withFileState((state) => [...state.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), false)
  );
}

export async function savePost(post: MarketingPost): Promise<MarketingPost> {
  const result = await withDatabase(async (client) => {
    await client.query(
      `INSERT INTO marketing_posts (id, data, created_at, updated_at)
       VALUES ($1, $2::jsonb, $3, $4)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
      [post.id, JSON.stringify(post), post.createdAt, post.updatedAt],
    );
    return post;
  });
  if (result) return result;
  return withFileState((state) => {
    const index = state.posts.findIndex((item) => item.id === post.id);
    if (index === -1) state.posts.unshift(post);
    else state.posts[index] = post;
    return post;
  }, true);
}

export async function updatePost(
  id: string,
  update: (post: MarketingPost) => MarketingPost | null,
): Promise<MarketingPost | null> {
  const posts = await listPosts();
  const existing = posts.find((post) => post.id === id);
  if (!existing) return null;
  const updated = update(existing);
  if (!updated) return null;
  return savePost({ ...updated, updatedAt: new Date().toISOString() });
}

export async function listTrends(): Promise<MarketingTrend[]> {
  const rows = await withDatabase(async (client) =>
    (
      await client.query<{ data: MarketingTrend }>(
        "SELECT data FROM marketing_trends ORDER BY discovered_at DESC",
      )
    ).rows.map((row) => row.data),
  );
  if (rows) return rows;
  return withFileState((state) => state.trends, false);
}

export async function saveTrend(trend: MarketingTrend): Promise<MarketingTrend> {
  const result = await withDatabase(async (client) => {
    await client.query(
      `INSERT INTO marketing_trends (id, data, discovered_at)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, discovered_at = EXCLUDED.discovered_at`,
      [trend.id, JSON.stringify(trend), trend.discoveredAt],
    );
    return trend;
  });
  if (result) return result;
  return withFileState((state) => {
    const index = state.trends.findIndex((item) => item.id === trend.id);
    if (index === -1) state.trends.unshift(trend);
    else state.trends[index] = trend;
    return trend;
  }, true);
}

export async function saveTokenUsage(usage: TokenUsage): Promise<TokenUsage> {
  const result = await withDatabase(async (client) => {
    await client.query(
      "INSERT INTO ai_token_usage (id, data, created_at) VALUES ($1, $2::jsonb, $3)",
      [usage.id, JSON.stringify(usage), usage.createdAt],
    );
    return usage;
  });
  if (result) return result;
  return withFileState((state) => {
    state.usage.unshift(usage);
    return usage;
  }, true);
}

export async function getUsage(): Promise<TokenUsage[]> {
  const rows = await withDatabase(async (client) =>
    (
      await client.query<{ data: TokenUsage }>(
        "SELECT data FROM ai_token_usage ORDER BY created_at DESC",
      )
    ).rows.map((row) => row.data),
  );
  return rows ?? withFileState((state) => state.usage, false);
}

// --- Product Knowledge Base (Kho 1) ---
export async function listProductKnowledge(): Promise<ProductKnowledgeItem[]> {
  const rows = await withDatabase(async (client) =>
    (await client.query<{ data: ProductKnowledgeItem }>("SELECT data FROM product_knowledge ORDER BY created_at DESC"))
      .rows.map((r) => r.data),
  );
  if (rows) return rows;
  return withFileState((state) => state.productKnowledge, false);
}

export async function saveProductKnowledge(item: ProductKnowledgeItem): Promise<ProductKnowledgeItem> {
  const result = await withDatabase(async (client) => {
    await client.query(
      `INSERT INTO product_knowledge (id, data, created_at)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [item.id, JSON.stringify(item), item.createdAt],
    );
    return item;
  });
  if (result) return result;
  return withFileState((state) => {
    const index = state.productKnowledge.findIndex((x) => x.id === item.id);
    if (index === -1) state.productKnowledge.unshift(item);
    else state.productKnowledge[index] = item;
    return item;
  }, true);
}

// --- Brand Voices & Auto-Tuning ---
export async function listBrandVoices(): Promise<BrandVoice[]> {
  const rows = await withDatabase(async (client) =>
    (await client.query<{ data: BrandVoice }>("SELECT data FROM brand_voices ORDER BY created_at DESC")).rows.map(
      (r) => r.data,
    ),
  );
  if (rows) return rows;
  return withFileState((state) => state.brandVoices, false);
}

export async function saveBrandVoice(voice: BrandVoice): Promise<BrandVoice> {
  const result = await withDatabase(async (client) => {
    await client.query(
      `INSERT INTO brand_voices (id, data, created_at)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [voice.id, JSON.stringify(voice), voice.createdAt],
    );
    return voice;
  });
  if (result) return result;
  return withFileState((state) => {
    const index = state.brandVoices.findIndex((x) => x.id === voice.id);
    if (index === -1) state.brandVoices.unshift(voice);
    else state.brandVoices[index] = voice;
    return voice;
  }, true);
}

// --- Growth Reports ---
export async function listGrowthReports(): Promise<GrowthReport[]> {
  const rows = await withDatabase(async (client) =>
    (await client.query<{ data: GrowthReport }>("SELECT data FROM growth_reports ORDER BY created_at DESC")).rows.map(
      (r) => r.data,
    ),
  );
  if (rows) return rows;
  return withFileState((state) => state.growthReports, false);
}

export async function saveGrowthReport(report: GrowthReport): Promise<GrowthReport> {
  const result = await withDatabase(async (client) => {
    await client.query(
      `INSERT INTO growth_reports (id, data, created_at)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [report.id, JSON.stringify(report), report.createdAt],
    );
    return report;
  });
  if (result) return result;
  return withFileState((state) => {
    state.growthReports.unshift(report);
    return report;
  }, true);
}

export function getStorageMode() {
  return pool ? "postgres-with-local-fallback" : "local-file";
}
