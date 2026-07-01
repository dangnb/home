import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    // Admin User: password = 'password123' -> hashed with bcrypt
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingUser) {
        const bcrypt = require('bcrypt');
        const password = await bcrypt.hash('password123', 10);
        await prisma.user.create({
            data: {
                name: 'Admin',
                email: adminEmail,
                password,
                role: 'ADMIN',
            },
        });
        console.log('Admin user created: admin@example.com / password123');
    }

    // Settings
    const settings = [
        { key: 'heroTitle', value: 'AN TOÀN - SỨC KHỎE - MÔI TRƯỜNG' },
        { key: 'heroSubtitle', value: 'Giải pháp tổng thể' },
        { key: 'heroDesc', value: 'Đồng hành cùng doanh nghiệp phát triển bền vững với các dịch vụ kiểm định, chứng nhận và huấn luyện an toàn hàng đầu.' },
        { key: 'siteName', value: 'Vinesh' },
        { key: 'phone', value: '0984 929 693' },
    ];

    for (const s of settings) {
        await prisma.setting.upsert({
            where: { key: s.key },
            update: {},
            create: s,
        });
    }

    // Services
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

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
