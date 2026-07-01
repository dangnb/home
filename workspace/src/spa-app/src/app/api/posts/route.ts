import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const posts = await readDb('posts');
  return NextResponse.json({ success: true, data: posts || [] });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const posts = (await readDb('posts')) || [];
    
    const newPost = {
      ...data,
      date: data.date || new Date().toISOString(),
    };
    
    posts.unshift(newPost);
    await writeDb('posts', posts);
    
    return NextResponse.json({ success: true, data: newPost });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo bài viết' }, { status: 500 });
  }
}
