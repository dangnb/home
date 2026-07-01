import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const careers = await readDb('careers');
  const item = careers?.find((p: any) => p.id === id);
  if (item) {
    return NextResponse.json({ success: true, data: item });
  }
  return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const data = await request.json();
    const careers = (await readDb('careers')) || [];
    
    const index = careers.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      careers[index] = { ...careers[index], ...data };
      await writeDb('careers', careers);
      return NextResponse.json({ success: true, data: careers[index] });
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
    let careers = (await readDb('careers')) || [];
    
    const index = careers.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      careers.splice(index, 1);
      await writeDb('careers', careers);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa' }, { status: 500 });
  }
}
