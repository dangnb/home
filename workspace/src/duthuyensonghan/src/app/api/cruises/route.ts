import { getCruises, createCruise, type Cruise } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return Response.json(getCruises());
}

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body: Cruise = await request.json();
  const all = getCruises();
  if (all.find((c) => c.slug === body.slug)) {
    return Response.json({ error: "Slug đã tồn tại" }, { status: 400 });
  }
  createCruise(body);
  return Response.json(body, { status: 201 });
}
