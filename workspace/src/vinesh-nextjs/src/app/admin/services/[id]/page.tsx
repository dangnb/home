import prisma from "@/lib/prisma";
import { saveService } from "../../actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditServiceForm from "./EditServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
        redirect("/admin/services");
    }

    // Fetch languages from DB
    const langRecords = await prisma.language.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    const languages = langRecords.map(l => l.code);
    languages.sort((a, b) => a === 'vi' ? -1 : b === 'vi' ? 1 : 0);

    // Parse translations
    const translations = service.translations ? JSON.parse(service.translations) : {};
    const updateAction = saveService.bind(null, service.id);

    const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });

    return (
        <div className="admin-container">
            <div className="admin-page-header">
                <div>
                    <Link href="/admin/services" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <i className="ph ph-arrow-left"></i> Quay lại
                    </Link>
                    <h1 className="admin-page-title" style={{ marginTop: "10px" }}>Sửa Bài viết</h1>
                </div>
            </div>

            <EditServiceForm service={service} languages={languages} translations={translations} categories={categories} action={updateAction} />
        </div>
    );
}
