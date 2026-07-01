import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const careers = await readDb('careers');
  return NextResponse.json({ success: true, data: careers || [] });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const careers = (await readDb('careers')) || [];
    
    const newItem = { ...data };
    
    careers.unshift(newItem);
    await writeDb('careers', careers);
    
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo' }, { status: 500 });
  }
}
