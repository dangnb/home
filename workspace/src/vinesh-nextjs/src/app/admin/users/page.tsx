import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserTableAction from "./UserTableAction";
import CreateUserForm from "./CreateUserForm";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN") {
        redirect("/admin");
    }

    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true },
        orderBy: { email: 'asc' }
    });

    return (
        <div className="admin-container-large">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Quản lý Người dùng & Phân Quyền</h1>
                    <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Khóa/Cấp quyền ADMIN / EDITOR cho các thành viên trong hệ thống.</p>
                </div>
            </div>

            <CreateUserForm />

            <div className="admin-card">
                <UserTableAction users={users} />
            </div>

        </div>
    )
}
