"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function updateSettings(formData: FormData) {
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
        if (typeof value === "object" && value !== null && "size" in value && value.size > 0) {
            // It's a file
            const file = value as any;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true }).catch(() => null);

            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            const filePath = join(uploadDir, fileName);
            await writeFile(filePath, buffer);

            const publicUrl = `/uploads/${fileName}`;
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
    await prisma.service.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/services");
}

export async function saveService(id: string | undefined, formData: FormData) {
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
    await prisma.language.update({ where: { code }, data: { isActive: !isActive } });
    revalidatePath("/", "layout");
}

export async function deleteLanguage(code: string) {
    await prisma.language.delete({ where: { code } });
    revalidatePath("/", "layout");
}

export async function updateUserRole(userId: string, role: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });
    revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId },
    });
    revalidatePath("/admin/users");
}

export async function createUser(formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!email || !password) return { success: false, error: "Thiếu email hoặc mật khẩu" };

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
    const slug = formData.get("slug") as string;
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    const isActiveStr = formData.get("isActive") as string;
    const isActive = isActiveStr === "true";

    // Parse translations (just title)
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
    await prisma.category.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/categories");
}

export async function deleteSlide(id: string) {
    await prisma.slide.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/slides");
}

export async function saveSlide(id: string | undefined, formData: FormData) {
    const orderStr = formData.get("order") as string;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    const isActive = formData.get("isActive") === "on";
    const linkUrl = formData.get("linkUrl") as string;

    // Handle File Upload
    let imageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("imageFile") as any;
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = join(process.cwd(), 'public', 'uploads', fileName);
        await writeFile(filePath, buffer);
        imageUrl = `/uploads/${fileName}`;
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
