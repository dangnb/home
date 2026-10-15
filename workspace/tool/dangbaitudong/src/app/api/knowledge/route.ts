import { randomUUID } from "node:crypto";
import { listProductKnowledge, saveProductKnowledge, type ProductKnowledgeItem } from "@/lib/marketing-store";

export async function GET() {
  const items = await listProductKnowledge();
  return Response.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const contentText = typeof body?.contentText === "string" ? body.contentText.trim() : "";
  const category = (typeof body?.category === "string" ? body.category : "usp") as ProductKnowledgeItem["category"];
  const tags = Array.isArray(body?.tags) ? (body.tags as string[]) : [];

  if (!title || !contentText) {
    return Response.json({ error: "Tiêu đề và nội dung kiến thức sản phẩm là bắt buộc." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const item: ProductKnowledgeItem = {
    id: typeof body?.id === "string" && body.id ? body.id : randomUUID(),
    workspaceId: "default-workspace",
    title,
    category,
    contentText,
    tags,
    createdAt: now,
    updatedAt: now,
  };

  const saved = await saveProductKnowledge(item);
  return Response.json({ success: true, item: saved }, { status: 201 });
}
