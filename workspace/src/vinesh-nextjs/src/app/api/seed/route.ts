import { NextResponse } from 'next/server';

/**
 * API Seed — BỊ VÔ HIỆU HÓA
 * 
 * API này chỉ dùng trong quá trình phát triển (development).
 * Trên production, middleware.ts sẽ chặn truy cập tới endpoint này.
 * Ngoài ra, bản thân route cũng tự chặn nếu không phải dev mode.
 */
export async function GET() {
    // Double-check: chặn trên production ngay ở đây
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "API này bị vô hiệu hóa trên production." },
            { status: 403 }
        );
    }

    // Development only
    try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        const c1 = await prisma.category.create({
            data: {
                slug: 've-vinesh',
                order: 1,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    'vi': { title: 'Về Vinesh' },
                    'en': { title: 'About Vinesh' }
                })
            }
        });

        await prisma.category.create({
            data: {
                slug: 'thong-diep-lanh-dao',
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: c1.id,
                translations: JSON.stringify({
                    'vi': { title: 'Thông điệp Lãnh đạo' },
                    'en': { title: 'CEO Statement' }
                })
            }
        });

        await prisma.category.create({
            data: {
                slug: 'doi-ngu',
                order: 2,
                isActive: true,
                isMenu: true,
                parentId: c1.id,
                translations: JSON.stringify({
                    'vi': { title: 'Đội ngũ' },
                    'en': { title: 'Our Team' }
                })
            }
        });

        const c2 = await prisma.category.create({
            data: {
                slug: 'san-pham-dich-vu',
                order: 2,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    'vi': { title: 'Sản phẩm & Dịch vụ' },
                    'en': { title: 'Products & Services' }
                })
            }
        });

        await prisma.category.create({
            data: {
                slug: 'giai-phap-doanh-nghiep',
                order: 1,
                isActive: true,
                isMenu: true,
                parentId: c2.id,
                translations: JSON.stringify({
                    'vi': { title: 'Giải pháp Doanh nghiệp' },
                    'en': { title: 'Enterprise Solutions' }
                })
            }
        });

        await prisma.category.create({
            data: {
                slug: 'tin-tuc',
                order: 3,
                isActive: true,
                isMenu: true,
                translations: JSON.stringify({
                    'vi': { title: 'Tin tức & Sự kiện' },
                    'en': { title: 'News & Events' }
                })
            }
        });

        await prisma.$disconnect();

        return NextResponse.json({ success: true, message: "Đã tạo dữ liệu mẫu thành công!" });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
