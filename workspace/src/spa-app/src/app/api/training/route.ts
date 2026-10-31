import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const training = await readDb('training');
  return NextResponse.json({ success: true, data: training || [] });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const training = (await readDb('training')) || [];
    
    const newItem = { ...data };
    
    training.unshift(newItem);
    await writeDb('training', training);
    
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo khóa đào tạo' }, { status: 500 });
  }
}
