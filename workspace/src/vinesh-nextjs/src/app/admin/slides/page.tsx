import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "../services/DeleteButton";
import { deleteSlide } from "../actions";
import { getTranslation } from "@/lib/utils";

export default async function SlidesList() {
    const slides = await prisma.slide.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="admin-container">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Quản lý Slider (Băng rôn)</h1>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>Kéo thả hoặc tạo mới các băng rôn để hiển thị nổi bật trên Trang chủ.</p>
                </div>
                <Link href="/admin/slides/new" className="admin-btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.95rem" }}>
                    <i className="ph ph-plus" style={{ fontWeight: "bold" }}></i> Tạo Slide mới
                </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", paddingBottom: "40px" }}>
                {slides.map(slide => {
                    const title = getTranslation(slide.translations, 'vi', 'title') || "Không có Tiêu đề";
                    const desc = getTranslation(slide.translations, 'vi', 'desc') || "";

                    return (
                        <div key={slide.id} className="admin-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", borderRadius: "12px", transition: "transform 0.2s" }}>
                            {/* Image Header */}
                            <div style={{
                                height: "180px",
                                backgroundImage: `url('${slide.imageUrl}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                position: "relative"
                            }}>
                                <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "8px" }}>
                                    <span style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", backdropFilter: "blur(4px)" }}>
                                        <i className="ph ph-hash"></i> Thứ tự: {slide.order}
                                    </span>
                                </div>
                                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                                    {slide.isActive ? (
                                        <span style={{ backgroundColor: "rgba(34, 197, 94, 0.9)", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" }}>Đang hiển thị</span>
                                    ) : (
                                        <span style={{ backgroundColor: "rgba(100, 116, 139, 0.9)", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" }}>Bị ẩn</span>
                                    )}
                                </div>
                                {/* Gradient Overlay */}
                                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}></div>
                            </div>

                            {/* Content Middle */}
                            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
                                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "700", lineHeight: "1.4" }}>
                                    {title}
                                </h3>
                                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", lineHeight: "1.5", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {desc || "Không có đoạn mô tả ngắn nào được cung cấp."}
                                </p>
                            </div>

                            {/* Footer Actions */}
                            <div style={{ padding: "12px 20px", backgroundColor: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                    ID: {slide.id.substring(slide.id.length - 6)}
                                </span>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <Link href={`/admin/slides/${slide.id}`} className="admin-action-btn action-edit" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "6px" }}>
                                        <i className="ph ph-pencil-simple"></i> Sửa
                                    </Link>
                                    <DeleteButton action={deleteSlide.bind(null, slide.id)} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {slides.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "2px dashed #cbd5e1" }}>
                    <i className="ph-fill ph-images" style={{ fontSize: "64px", color: "#94a3b8", marginBottom: "16px" }}></i>
                    <h3 style={{ margin: "0 0 8px 0", color: "#334155", fontSize: "1.2rem" }}>Chưa có Băng rôn nào</h3>
                    <p style={{ margin: "0 0 24px 0", color: "#64748b" }}>Tạo ngay một chiếc Slide để làm nổi bật trang chủ của bạn!</p>
                    <Link href="/admin/slides/new" className="admin-btn btn-primary" style={{ display: "inline-flex" }}>
                        Tạo Slide Mới
                    </Link>
                </div>
            )}
        </div>
    );
}
