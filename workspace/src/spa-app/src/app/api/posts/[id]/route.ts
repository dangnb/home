import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const posts = await readDb('posts');
  const post = posts?.find((p: any) => p.id === id);
  if (post) {
    return NextResponse.json({ success: true, data: post });
  }
  return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const data = await request.json();
    const posts = (await readDb('posts')) || [];
    
    const index = posts.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...data };
      await writeDb('posts', posts);
      return NextResponse.json({ success: true, data: posts[index] });
    }
    return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    let posts = (await readDb('posts')) || [];
    
    const index = posts.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      await writeDb('posts', posts);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa' }, { status: 500 });
  }
}
