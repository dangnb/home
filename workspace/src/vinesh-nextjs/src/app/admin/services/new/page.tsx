import prisma from "@/lib/prisma";
import { saveService } from "../../actions";
import Link from "next/link";
import NewServiceForm from "./NewServiceForm";

export default async function NewServicePage() {
    const createAction = saveService.bind(null, undefined);

    // Fetch languages from DB
    const langRecords = await prisma.language.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    const languages = langRecords.map(l => l.code);
    languages.sort((a, b) => a === 'vi' ? -1 : b === 'vi' ? 1 : 0);

    const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });

    return (
        <div className="admin-container">
            <div className="admin-page-header">
                <div>
                    <Link href="/admin/services" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <i className="ph ph-arrow-left"></i> Quay lại
                    </Link>
                    <h1 className="admin-page-title" style={{ marginTop: "10px" }}>Thêm Bài viết mới</h1>
                </div>
            </div>

            <NewServiceForm languages={languages} categories={categories} action={createAction} />
        </div>
    );
}
