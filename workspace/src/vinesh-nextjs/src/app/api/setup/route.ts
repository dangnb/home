import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * API Setup — BỊ VÔ HIỆU HÓA TRÊN PRODUCTION
 * 
 * API này tạo admin user + settings mặc định.
 * Chỉ chạy được ở môi trường development.
 */
export async function GET() {
    // Double-check: chặn trên production
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "API này bị vô hiệu hóa trên production." },
            { status: 403 }
        );
    }

    try {
        const bcrypt = await import('bcrypt');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
        const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!existingUser) {
            const password = await bcrypt.hash(adminPassword, 10);
            await prisma.user.create({
                data: {
                    name: 'Admin',
                    email: adminEmail,
                    password,
                    role: 'ADMIN',
                },
            });
        }

        const settings = [
            { key: 'heroTitle', value: 'GIẢI PHÁP CHĂM SÓC & VẬN HÀNH DOANH NGHIỆP' },
            { key: 'heroSubtitle', value: 'Giải pháp tổng thể WebCare' },
            { key: 'heroDesc', value: 'Đồng hành cùng doanh nghiệp phát triển bền vững với các giải pháp tư vấn, dịch vụ kỹ thuật và hỗ trợ chuyên nghiệp hàng đầu.' },
            { key: 'siteName', value: 'WebCare' },
            { key: 'phone', value: '0984 929 693' },
        ];

        for (const s of settings) {
            await prisma.setting.upsert({
                where: { key: s.key },
                update: {},
                create: s,
            });
        }

        const services = [
            { title: 'Quan trắc môi trường lao động', imageUrl: '/assets/service1.png', linkUrl: '#', order: 1 },
            { title: 'Phân loại lao động', imageUrl: '/assets/service2.png', linkUrl: '#', order: 2 },
            { title: 'Hợp chuẩn – hợp quy', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop', linkUrl: '#', order: 3 },
            { title: 'Huấn luyện an toàn, vệ sinh', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop', linkUrl: '#', order: 4 },
        ];

        for (const s of services) {
            const exists = await prisma.service.findFirst({ where: { title: s.title } });
            if (!exists) {
                await prisma.service.create({ data: s });
            }
        }

        return NextResponse.json({ message: 'Seeding completed!' });
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
