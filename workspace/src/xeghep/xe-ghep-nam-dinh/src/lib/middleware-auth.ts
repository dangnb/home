import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function getAuthUser(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}
