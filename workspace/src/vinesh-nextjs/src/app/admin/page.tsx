import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
    const serviceCount = await prisma.service.count();
    const settingsCount = await prisma.setting.count();

    return (
        <div className="admin-container-large">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Tổng quan Hệ thống</h1>
            </div>

            <div className="admin-stat-grid">
                {/* Stat Card 1 */}
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                        <i className="ph ph-briefcase"></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tổng Dịch vụ</h3>
                        <p style={{ margin: "4px 0 0", fontSize: "1.8rem", fontWeight: "700", color: "#0f172a" }}>{serviceCount}</p>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                        <i className="ph ph-gear"></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Biến Cấu hình</h3>
                        <p style={{ margin: "4px 0 0", fontSize: "1.8rem", fontWeight: "700", color: "#0f172a" }}>{settingsCount}</p>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h2 style={{ fontSize: "1.25rem", margin: "0 0 15px", color: "#0f172a" }}><i className="ph ph-chart-line-up"></i> Khuyến nghị Chuẩn SEO</h2>
                <ul style={{ listStyle: "disc", paddingLeft: "20px", color: "#475569", lineHeight: "1.6" }}>
                    <li><strong>Tiêu đề trang (Title):</strong> Nên giới hạn từ <strong>50 - 60 ký tự</strong> để hiển thị tốt nhất trên Google.</li>
                    <li><strong>Mô tả (Description):</strong> Tốt nhất từ <strong>150 - 160 ký tự</strong>, chú ý chứa từ khóa chính gọn gàng.</li>
                    <li><strong>Hình ảnh:</strong> Cung cấp URL hợp lệ (`https://...`), nên nén hình ảnh trước khi lưu thẻ Link để tốc độ load được cải thiện.</li>
                    <li><strong>Text ngắn gọn:</strong> Cố gắng không nhồi nhé từ khóa, tạo trải nghiệm tự nhiên cho khách hàng.</li>
                </ul>
            </div>
        </div>
    );
}
