import { getSettings, saveSettings } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return Response.json(getSettings());
}

export async function PUT(request: Request) {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  saveSettings(body);
  return Response.json({ success: true });
}
