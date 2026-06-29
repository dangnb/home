import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SlideForm from "../SlideForm";

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const slide = await prisma.slide.findUnique({ where: { id } });

    if (!slide) notFound();

    const langRecords = await prisma.language.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    const languages = langRecords.map(l => l.code);
    languages.sort((a, b) => a === 'vi' ? -1 : b === 'vi' ? 1 : 0);

    return (
        <div className="admin-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Sửa Slide</h1>
            </div>
            <SlideForm slide={slide} languages={languages} />
        </div>
    );
}
