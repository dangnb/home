import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Clear all categories first if needed, but let's just create new ones cautiously
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

        const c3 = await prisma.category.create({
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

        return NextResponse.json({ success: true, message: "Đã tạo dữ liệu mẫu thành công!" });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
