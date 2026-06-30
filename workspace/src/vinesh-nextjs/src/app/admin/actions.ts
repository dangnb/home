"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized: Bạn chưa đăng nhập");
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "EDITOR") {
        throw new Error("Forbidden: Bạn không có quyền thực hiện hành động này");
    }
    return session;
}

export async function updateSettings(formData: FormData) {
    await requireAdmin();
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
        if (typeof value === "object" && value !== null && "size" in value && value.size > 0) {
            // Validate File Size (Max 5MB)
            if (value.size > 5 * 1024 * 1024) throw new Error("File quá lớn, yêu cầu < 5MB");

            // It's a file
            const file = value as any;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true }).catch(() => null);

            // Secure filename
            const ext = file.name.split('.').pop();
            const secureFileName = `${crypto.randomUUID()}.${ext}`;
            const filePath = join(uploadDir, secureFileName);
            await writeFile(filePath, buffer);

            const publicUrl = `/uploads/${secureFileName}`;
            await prisma.setting.upsert({
                where: { key: key },
                update: { value: publicUrl },
                create: { key, value: publicUrl }
            });
        } else if (typeof value === "string") {
            if (value.trim() !== "" || key.startsWith("hero")) {
                await prisma.setting.upsert({
                    where: { key: key },
                    update: { value: value },
                    create: { key, value: value }
                });
            }
        }
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
}

export async function deleteService(id: string) {
    await requireAdmin();
    await prisma.service.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/services");
}

export async function saveService(id: string | undefined, formData: FormData) {
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;

    let categoryId = formData.get("categoryId") as string;
    if (categoryId === "") categoryId = null as any;

    const translations: Record<string, { title: string; description: string }> = {};

    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
        if (key.startsWith("title_")) {
            const code = key.replace("title_", "");
            if (!translations[code]) translations[code] = { title: "", description: "" };
            translations[code].title = value.toString();
        }
        if (key.startsWith("desc_")) {
            const code = key.replace("desc_", "");
            if (!translations[code]) translations[code] = { title: "", description: "" };
            translations[code].description = value.toString();
        }
    });

    const translationsString = JSON.stringify(translations);

    if (id) {
        await prisma.service.update({
            where: { id },
            data: { title, description, translations: translationsString, imageUrl, linkUrl, order, categoryId }
        });
    } else {
        await prisma.service.create({
            data: { title, description, translations: translationsString, imageUrl, linkUrl, order, categoryId }
        });
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/services");
    redirect("/admin/services");
}

export async function saveLanguage(formData: FormData) {
    await requireAdmin();
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    await prisma.language.upsert({
        where: { code: code.toLowerCase() },
        create: { code: code.toLowerCase(), name },
        update: { name }
    });
    revalidatePath("/", "layout");
}

export async function toggleLanguage(code: string, isActive: boolean) {
    await requireAdmin();
    await prisma.language.update({ where: { code }, data: { isActive: !isActive } });
    revalidatePath("/", "layout");
}

export async function deleteLanguage(code: string) {
    await requireAdmin();
    await prisma.language.delete({ where: { code } });
    revalidatePath("/", "layout");
}

export async function updateUserRole(userId: string, role: string) {
    await requireAdmin();
    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });
    revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
    await requireAdmin();
    await prisma.user.delete({
        where: { id: userId },
    });
    revalidatePath("/admin/users");
}

export async function createUser(formData: FormData) {
    // Only full admin can create users
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return { success: false, error: "Bạn phải là Quản trị viên (ADMIN) mới có quyền tạo User" };
    }

    const email = (formData.get("email") as string)?.trim();
    const name = (formData.get("name") as string)?.trim();
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!email || !password) return { success: false, error: "Thiếu email hoặc mật khẩu" };
    if (password.length < 6) return { success: false, error: "Mật khẩu phải từ 6 ký tự trở lên" };

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { success: false, error: "Email đã tồn tại trong hệ thống" };

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { email, name, password: hashedPassword, role }
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function saveCategory(id: string | undefined, formData: FormData) {
    await requireAdmin();
    const slug = formData.get("slug") as string;
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    const isActiveStr = formData.get("isActive") as string;
    const isActive = isActiveStr === "true";

    const translations: Record<string, { title: string }> = {};
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
        if (key.startsWith("title_")) {
            const code = key.replace("title_", "");
            translations[code] = { title: value.toString() };
        }
    });

    const parsedTranslations = JSON.stringify(translations);

    if (id && id !== "new") {
        await prisma.category.update({
            where: { id },
            data: { slug, order, isActive, translations: parsedTranslations }
        });
    } else {
        await prisma.category.create({
            data: { slug, order, isActive, translations: parsedTranslations }
        });
    }
    revalidatePath("/", "layout");
    redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
    await requireAdmin();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/categories");
}

export async function deleteSlide(id: string) {
    await requireAdmin();
    await prisma.slide.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/slides");
}

export async function saveSlide(id: string | undefined, formData: FormData) {
    await requireAdmin();
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    const isActive = formData.get("isActive") === "on";
    const linkUrl = formData.get("linkUrl") as string;

    // Handle Secure File Upload
    let imageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("imageFile") as any;

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
        if (imageFile.size > 5 * 1024 * 1024) {
            throw new Error("Kích thước file ảnh Slide vượt quá 5MB");
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Random UUID filename to prevent directory traversal and name clash
        const ext = imageFile.name.split('.').pop() || 'png';
        const secureFileName = `${crypto.randomUUID()}.${ext}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true }).catch(() => null);
        const filePath = join(uploadDir, secureFileName);

        await writeFile(filePath, buffer);
        imageUrl = `/uploads/${secureFileName}`;
    }

    if (!imageUrl) imageUrl = "";

    const translations: Record<string, { title: string; subtitle: string; desc: string }> = {};
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
        if (key.startsWith("title_")) {
            const code = key.replace("title_", "");
            if (!translations[code]) translations[code] = { title: "", subtitle: "", desc: "" };
            translations[code].title = value.toString();
        }
        if (key.startsWith("subtitle_")) {
            const code = key.replace("subtitle_", "");
            if (!translations[code]) translations[code] = { title: "", subtitle: "", desc: "" };
            translations[code].subtitle = value.toString();
        }
        if (key.startsWith("desc_")) {
            const code = key.replace("desc_", "");
            if (!translations[code]) translations[code] = { title: "", subtitle: "", desc: "" };
            translations[code].desc = value.toString();
        }
    });

    const parsedTranslations = JSON.stringify(translations);

    if (id && id !== "new") {
        await prisma.slide.update({
            where: { id },
            data: { imageUrl, linkUrl, order, isActive, translations: parsedTranslations }
        });
    } else {
        await prisma.slide.create({
            data: { imageUrl, linkUrl, order, isActive, translations: parsedTranslations }
        });
    }

    revalidatePath("/", "layout");
    redirect("/admin/slides");
}

export async function deletePage(id: string) {
    await requireAdmin();
    await prisma.page.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");
}

export async function savePage(id: string | undefined, formData: FormData) {
    await requireAdmin();
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isActiveStr = formData.get("isActive") as string;
    const isActive = isActiveStr === "true";

    if (id && id !== "new") {
        await prisma.page.update({
            where: { id },
            data: { slug, title, content, isActive }
        });
    } else {
        await prisma.page.create({
            data: { slug, title, content, isActive }
        });
    }
    revalidatePath("/", "layout");
    redirect("/admin/pages");
}

