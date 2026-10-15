import { listPosts, listProductKnowledge, type MarketingPost, type ProductKnowledgeItem } from "@/lib/marketing-store";

const winningCollection = process.env.QDRANT_COLLECTION ?? "winning-posts";
const productKnowledgeCollection = process.env.QDRANT_KB_COLLECTION ?? "product-knowledge";
const qdrantUrl = process.env.QDRANT_URL?.replace(/\/$/, "");

function getEmbeddingKey() {
  return process.env.OPENAI_API_KEY;
}

async function embedText(text: string): Promise<number[] | null> {
  const apiKey = getEmbeddingKey();
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: Array<{ embedding?: number[] }> };
    return payload.data?.[0]?.embedding ?? null;
  } catch (err) {
    console.warn("Embedding API call failed; using keyword search fallback.", err);
    return null;
  }
}

async function ensureCollection(name: string) {
  if (!qdrantUrl) return false;
  try {
    const response = await fetch(`${qdrantUrl}/collections/${name}`);
    if (response.ok) return true;
    if (response.status !== 404) return false;

    const created = await fetch(`${qdrantUrl}/collections/${name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vectors: { size: 1536, distance: "Cosine" } }),
    });
    return created.ok;
  } catch {
    return false;
  }
}

// --- KHO 2: FEW-SHOT WINNING POSTS ---
export async function retrieveWinningPosts(query: string): Promise<Array<{ title: string; body: string; formula: string }>> {
  // If Qdrant is available with embeddings
  if (qdrantUrl && getEmbeddingKey()) {
    try {
      const ready = await ensureCollection(winningCollection);
      if (ready) {
        const vector = await embedText(query);
        if (vector) {
          const response = await fetch(`${qdrantUrl}/collections/${winningCollection}/points/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vector, limit: 3, with_payload: true }),
          });
          if (response.ok) {
            const result = (await response.json()) as { result?: Array<{ payload?: Record<string, unknown> }> };
            const points = (result.result ?? []).flatMap((point) => {
              const payload = point.payload;
              if (typeof payload?.body !== "string" || typeof payload?.title !== "string") return [];
              return [{ title: payload.title, body: payload.body, formula: String(payload.formula ?? "PAS") }];
            });
            if (points.length > 0) return points;
          }
        }
      }
    } catch (error) {
      console.warn("Qdrant retrieval error, falling back to local store.", error);
    }
  }

  // Local fallback: rank published posts with engagement
  const terms = new Set(
    query
      .toLowerCase()
      .split(/\W+/)
      .filter((term) => term.length > 2),
  );
  const posts = await listPosts();
  return posts
    .filter((post) => post.status === "published" || (post.metrics?.engagements ?? 0) > 0)
    .map((post) => {
      const text = `${post.topic} ${post.title} ${post.body}`.toLowerCase();
      const score = [...terms].reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);
      return { title: post.title, body: post.body, formula: post.formula || "PAS", score };
    })
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ title, body, formula }) => ({ title, body, formula }));
}

export async function indexWinningPost(post: MarketingPost): Promise<boolean> {
  if (!qdrantUrl || !getEmbeddingKey()) return false;
  try {
    const ready = await ensureCollection(winningCollection);
    if (!ready) return false;

    const vector = await embedText(`${post.topic}\n${post.title}\n${post.body}`);
    if (!vector) return false;

    const response = await fetch(`${qdrantUrl}/collections/${winningCollection}/points?wait=true`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [
          {
            id: post.id,
            vector,
            payload: { topic: post.topic, title: post.title, body: post.body, formula: post.formula },
          },
        ],
      }),
    });
    return response.ok;
  } catch (error) {
    console.warn("Could not index winning post in Qdrant.", error);
    return false;
  }
}

// --- KHO 1: PRODUCT KNOWLEDGE BASE (Anti-hallucination) ---
export async function retrieveProductKnowledge(query: string): Promise<ProductKnowledgeItem[]> {
  const allKnowledge = await listProductKnowledge();
  if (allKnowledge.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // Score items by matching title, contentText and tags
  const scored = allKnowledge.map((item) => {
    let score = 0;
    const lowerContent = `${item.title} ${item.contentText} ${item.tags.join(" ")}`.toLowerCase();
    for (const term of queryTerms) {
      if (lowerContent.includes(term)) score += 2;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.item);
}
