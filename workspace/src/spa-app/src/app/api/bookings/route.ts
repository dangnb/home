import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const bookings = await readDb('bookings');
  return NextResponse.json({ success: true, data: bookings || [] });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const bookings = (await readDb('bookings')) || [];
    
    const newBooking = {
      id: Date.now().toString(),
      name: data.name || '',
      phone: data.phone || '',
      service: data.service || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    bookings.unshift(newBooking);
    await writeDb('bookings', bookings);
    
    return NextResponse.json({ success: true, data: newBooking });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi đặt lịch hẹn' }, { status: 500 });
  }
}
