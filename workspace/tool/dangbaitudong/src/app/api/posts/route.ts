import { listPosts } from "@/lib/marketing-store";

export async function GET() {
  return Response.json({ posts: await listPosts() });
}