import { NextResponse } from 'next/server';
import { seedDemoData } from '@/lib/seedDemoData';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    try {
        const result = await seedDemoData(force);
        return NextResponse.json({
            success: true,
            message: "Đã khởi tạo và đồng bộ đầy đủ dữ liệu demo song ngữ (VI & EN) thành công!",
            result
        });
    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Đã xảy ra lỗi khi tạo dữ liệu mẫu";
        console.error("❌ Seed API error:", e);
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
}
