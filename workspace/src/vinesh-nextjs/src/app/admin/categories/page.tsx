import prisma from "@/lib/prisma";
import Link from "next/link";
import { deleteCategory } from "../actions";
import DeleteButton from "../services/DeleteButton";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    const languages = await prisma.language.findMany();
    const vi = languages.find(l => l.isDefault)?.code || "vi";

    return (
        <div className="admin-container-large">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Quản lý Danh mục Bài viết</h1>
                <Link href="/admin/categories/new" className="admin-btn btn-primary">
                    <i className="ph ph-plus-circle"></i> Thêm Danh mục
                </Link>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>STT</th>
                                <th>Tên Danh mục</th>
                                <th>Slug (URL)</th>
                                <th>Trạng thái</th>
                                <th style={{ width: "120px" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => {
                                const delAction = deleteCategory.bind(null, cat.id);
                                let title = cat.slug;
                                try {
                                    const trans = JSON.parse(cat.translations || "{}");
                                    if (trans[vi]?.title) title = trans[vi].title;
                                } catch (e) { }

                                return (
                                    <tr key={cat.id}>
                                        <td>
                                            <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                                                {cat.order}
                                            </span>
                                        </td>
                                        <td><strong>{title}</strong></td>
                                        <td><code>{cat.slug}</code></td>
                                        <td>
                                            {cat.isActive ? <span className="seo-good">Hoạt động</span> : <span className="seo-bad">Đã Tắt</span>}
                                        </td>
                                        <td>
                                            <div className="td-actions">
                                                <Link href={`/admin/categories/${cat.id}`} className="admin-btn btn-outline" style={{ padding: "6px 12px" }}>
                                                    <i className="ph ph-pencil-simple"></i>
                                                </Link>
                                                <DeleteButton action={delAction} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Chưa có danh mục nào trong hệ thống.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
