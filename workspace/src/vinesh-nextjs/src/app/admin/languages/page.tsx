import prisma from "@/lib/prisma";
import { saveLanguage, toggleLanguage, deleteLanguage } from "../actions";
import DeleteButton from "../services/DeleteButton";

export default async function LanguagesPage() {
    const languages = await prisma.language.findMany({ orderBy: { code: "asc" } });

    return (
        <div className="admin-container-large">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Quản lý Ngôn ngữ (Language Dictionary)</h1>
            </div>

            <div className="admin-stat-grid" style={{ gridTemplateColumns: "1fr 2fr", alignItems: "start" }}>

                {/* Add Language Form */}
                <div className="admin-card">
                    <h2 style={{ fontSize: "1.1rem", marginBottom: "15px" }}><i className="ph ph-plus-circle"></i> Thêm Ngôn ngữ</h2>
                    <form action={saveLanguage}>
                        <div className="admin-form-group">
                            <label className="admin-label">Mã Ngôn Ngữ (VD: vi, en, ja, ko, zh)</label>
                            <input type="text" name="code" className="admin-input" required maxLength={5} placeholder="Ví dụ: vi" />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Tên Ngôn Ngữ (VD: Tiếng Việt, English)</label>
                            <input type="text" name="name" className="admin-input" required />
                        </div>

                        <button type="submit" className="admin-btn btn-success" style={{ width: "100%" }}>Lưu Ngôn Ngữ</button>
                    </form>
                </div>

                {/* List Languages */}
                <div className="admin-card">
                    <h2 style={{ fontSize: "1.1rem", marginBottom: "15px" }}><i className="ph ph-list"></i> Danh sách cấu hình</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã (Code)</th>
                                <th>Tên (Name)</th>
                                <th>Trạng thái</th>
                                <th style={{ width: "150px" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {languages.map(lang => {
                                const toggleAction = toggleLanguage.bind(null, lang.code, lang.isActive);
                                const deleteAction = deleteLanguage.bind(null, lang.code);
                                return (
                                    <tr key={lang.code}>
                                        <td><span style={{ background: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>{lang.code.toUpperCase()}</span></td>
                                        <td><strong>{lang.name}</strong> {lang.isDefault && <span style={{ color: "#3b82f6", fontSize: "0.8rem", marginLeft: "5px" }}>(Gốc)</span>}</td>
                                        <td>
                                            {lang.isActive ? <span className="seo-good">Đang bật</span> : <span className="seo-bad">Đã tắt</span>}
                                        </td>
                                        <td>
                                            <div className="td-actions">
                                                {/* Toggle Button */}
                                                <form action={toggleAction}>
                                                    <button type="submit" className={`admin-btn ${lang.isActive ? 'btn-outline' : 'btn-success'}`} style={{ padding: "6px 12px" }}>
                                                        <i className={`ph ${lang.isActive ? 'ph-eye-slash' : 'ph-eye'}`}></i>
                                                    </button>
                                                </form>

                                                {/* Delete Button */}
                                                {!lang.isDefault && (
                                                    <DeleteButton action={deleteAction} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
