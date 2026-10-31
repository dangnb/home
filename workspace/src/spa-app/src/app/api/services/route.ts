import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const services = await readDb('services');
  return NextResponse.json({ success: true, data: services || [] });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const services = (await readDb('services')) || [];
    
    const newItem = { ...data };
    
    services.unshift(newItem);
    await writeDb('services', services);
    
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo dịch vụ' }, { status: 500 });
  }
}
