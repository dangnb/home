import { getCategories, saveCategories, type Category } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const data = getCategories();
  return Response.json(data);
}

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body: Category = await request.json();
  const all = getCategories();
  if (all.find((c) => c.id === body.id)) {
    return Response.json({ error: "ID đã tồn tại" }, { status: 400 });
  }
  all.push(body);
  saveCategories(all);
  return Response.json(body, { status: 201 });
}
