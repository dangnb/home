import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const data = await request.json();
    const bookings = (await readDb('bookings')) || [];
    
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...data };
      await writeDb('bookings', bookings);
      return NextResponse.json({ success: true, data: bookings[index] });
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
    const bookings = (await readDb('bookings')) || [];
    
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      bookings.splice(index, 1);
      await writeDb('bookings', bookings);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Không tìm thấy' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa' }, { status: 500 });
  }
}
