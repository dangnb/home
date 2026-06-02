import "server-only";
import { db } from "@/lib/db";

export async function getActiveJobPostings() {
  return db.jobPosting.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}
