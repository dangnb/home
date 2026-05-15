import type { NextRequest } from "next/server";
import { getPosts, createPost, type Post } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  let posts = getPosts();

  if (status && status !== "all") {
    posts = posts.filter((p) => p.status === status);
  }
  if (category) {
    posts = posts.filter((p) => p.categoryId === category);
  }

  return Response.json(posts);
}

export async function POST(request: Request) {
  if (!(await getSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Omit<Post, "id" | "createdAt" | "updatedAt"> = await request.json();

  if (!body.title || !body.slug) {
    return Response.json({ error: "Tiêu đề và slug là bắt buộc" }, { status: 400 });
  }

  const existing = getPosts().find((p) => p.slug === body.slug);
  if (existing) {
    return Response.json({ error: "Slug đã tồn tại" }, { status: 400 });
  }

  const newPost = createPost(body);
  return Response.json(newPost, { status: 201 });
}
