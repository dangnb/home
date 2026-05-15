import { getPosts, updatePost, deletePost } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPosts().find((p) => p.id === id);
  if (!post) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const ok = updatePost(id, body);
  if (!ok) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = deletePost(id);
  if (!ok) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json({ success: true });
}
