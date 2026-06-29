"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
export async function updateSettings(formData: FormData) {
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
        const stringValue = value.toString();
        await prisma.setting.upsert({
            where: { key: key },
            update: { value: stringValue },
            create: { key, value: stringValue }
        });
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
