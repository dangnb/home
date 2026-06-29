import SlideForm from "../SlideForm";
import prisma from "@/lib/prisma";

export default async function NewSlidePage() {
    const langRecords = await prisma.language.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    const languages = langRecords.map(l => l.code);
    languages.sort((a, b) => a === 'vi' ? -1 : b === 'vi' ? 1 : 0);

    return (
        <div className="admin-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Thêm Slide Mới</h1>
            </div>
            <SlideForm languages={languages} />
        </div>
    );
}
