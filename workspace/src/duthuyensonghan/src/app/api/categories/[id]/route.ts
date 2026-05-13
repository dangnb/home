import { getCategories, saveCategories } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const all = getCategories();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  all[idx] = { ...all[idx], ...body };
  saveCategories(all);
  return Response.json(all[idx]);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const all = getCategories();
  const filtered = all.filter((c) => c.id !== id);
  if (filtered.length === all.length) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  saveCategories(filtered);
  return Response.json({ success: true });
}
