import { getPricing, savePricing } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return Response.json(getPricing());
}

export async function PUT(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  savePricing(body);
  return Response.json({ success: true });
}
