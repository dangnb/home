import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const users = await readDb('users');
    const user = users?.find((u: any) => u.username === username && u.password === password);

    if (user) {
      // Don't include password in session
      const { password: _, ...userWithoutPassword } = user;
      await setSession(userWithoutPassword);
      return NextResponse.json({ success: true, user: userWithoutPassword });
    }

    return NextResponse.json(
      { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
