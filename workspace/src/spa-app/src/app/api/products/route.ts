import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const products = await readDb('products');
  return NextResponse.json({ success: true, data: products || [] });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const products = (await readDb('products')) || [];
    
    const newProduct = { ...data };
    
    products.unshift(newProduct);
    await writeDb('products', products);
    
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo sản phẩm' }, { status: 500 });
  }
}
