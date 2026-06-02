import "server-only";
import { db } from "@/lib/db";

export async function getAdminDashboardStats() {
  const [newOrders, pendingApplications, pendingReviews, activeProducts, publishedNews, draftNews] = await Promise.all([
    db.order.count({ where: { status: "NEW" } }),
    db.jobApplication.count({ where: { status: "NEW" } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.product.count({ where: { status: "ACTIVE" } }),
    db.newsPost.count({ where: { status: "PUBLISHED" } }),
    db.newsPost.count({ where: { status: "DRAFT" } }),
  ]);

  return { newOrders, pendingApplications, pendingReviews, activeProducts, publishedNews, draftNews };
}
