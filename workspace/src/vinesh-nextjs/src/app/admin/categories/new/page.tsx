import prisma from "@/lib/prisma";
import CategoryForm from "../CategoryForm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewCategoryPage() {
    const languages = await prisma.language.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    const allCategories = await prisma.category.findMany({ orderBy: { order: 'asc' } });

    return (
        <div className="admin-container-large">
            <div className="admin-page-header">
                <Link href="/admin/categories" className="admin-btn btn-outline">
                    <i className="ph ph-arrow-left"></i> Quay lại
                </Link>
                <h1 className="admin-page-title" style={{ marginLeft: "15px" }}>Thêm Danh mục Mới</h1>
            </div>

            <CategoryForm languages={languages} allCategories={allCategories} />
        </div>
    )
}
