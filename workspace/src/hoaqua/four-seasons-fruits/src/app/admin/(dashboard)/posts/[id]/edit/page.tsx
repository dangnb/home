// Edit Post Page

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const post = await db.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <PostForm initialData={post} />
    </div>
  );
}
