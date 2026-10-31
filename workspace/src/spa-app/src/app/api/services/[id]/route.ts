import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const services = await readDb('services');
  const item = services?.find((p: any) => p.id === id || p.slug === id);
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
    const services = (await readDb('services')) || [];
    
    const index = services.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      services[index] = { ...services[index], ...data };
      await writeDb('services', services);
      return NextResponse.json({ success: true, data: services[index] });
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
    let services = (await readDb('services')) || [];
    
    const index = services.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      services.splice(index, 1);
      await writeDb('services', services);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa' }, { status: 500 });
  }
}
