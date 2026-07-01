import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const settings = await readDb('settings');
  return NextResponse.json({ success: true, data: settings || {} });
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await writeDb('settings', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi lưu cấu hình' }, { status: 500 });
  }
}
