import { getCruiseBySlug, updateCruise, deleteCruise } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cruise = getCruiseBySlug(slug);
  if (!cruise) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json(cruise);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const body = await request.json();
  const ok = updateCruise(slug, body);
  if (!ok) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const ok = deleteCruise(slug);
  if (!ok) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json({ success: true });
}
