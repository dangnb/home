import { AdminShell } from "@/components/AdminShell";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminRecruitmentPage() {
  const applications = await db.jobApplication.findMany({ include: { jobPosting: true }, orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Tuyển dụng</p>
        <h1 className="mt-3 text-4xl font-black text-[#2b160c]">Hồ sơ ứng tuyển</h1>
        <div className="mt-8 space-y-4">
          {applications.map((application) => (
            <article key={application.id} className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2b160c]">{application.fullName}</h2>
                  <p className="mt-2 font-bold text-[#75543d]">{application.position} · {application.phone}</p>
                </div>
                <p className="font-black text-[#d9863d]">{application.status}</p>
              </div>
              <p className="mt-3 text-sm font-bold text-[#b56b2a]">{formatDate(application.createdAt)}</p>
              <p className="mt-3 leading-7 text-[#75543d]">{application.message}</p>
            </article>
          ))}
        </div>
      </main>
    </AdminShell>
  );
}
