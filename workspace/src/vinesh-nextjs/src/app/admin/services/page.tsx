import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { deleteService } from "../actions";
import DeleteButton from "./DeleteButton";
import { Service } from "@prisma/client";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } }).catch(() => []);

    return (
        <div className="admin-container-large">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Quản lý Dịch vụ</h1>
                <Link href="/admin/services/new" className="admin-btn btn-primary">
                    <i className="ph ph-plus-circle"></i> Thêm Dịch vụ
                </Link>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>STT</th>
                                <th style={{ width: "100px" }}>Hình ảnh</th>
                                <th>Tên Dịch vụ</th>
                                <th>URL Liên kết</th>
                                <th style={{ width: "120px" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((svc: Service) => {
                                const delAction = deleteService.bind(null, svc.id);
                                const safeImg = (svc.imageUrl && !svc.imageUrl.includes("photo-1504917599217"))
                                    ? svc.imageUrl
                                    : "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop";

                                return (
                                    <tr key={svc.id}>
                                        <td>
                                            <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontWeight: "600" }}>
                                                {svc.order}
                                            </span>
                                        </td>
                                        <td>
                                            <Image src={safeImg} alt={svc.title} width={48} height={48} unoptimized style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                                        </td>
                                        <td>
                                            <strong style={{ display: "block", fontSize: "1rem" }}>{svc.title}</strong>
                                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                                {svc.description
                                                    ? (svc.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, 80) + (svc.description.length > 80 ? '...' : ''))
                                                    : "Không có mô tả"}
                                            </span>
                                        </td>
                                        <td>
                                            <a href={svc.linkUrl || "#"} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                                                {svc.linkUrl}
                                            </a>
                                        </td>
                                        <td>
                                            <div className="td-actions">
                                                <Link href={`/admin/services/${svc.id}`} className="admin-btn btn-outline" style={{ padding: "6px 12px" }}>
                                                    <i className="ph ph-pencil-simple"></i>
                                                </Link>
                                                <DeleteButton action={delAction} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Chưa có dịch vụ nào trong hệ thống.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
