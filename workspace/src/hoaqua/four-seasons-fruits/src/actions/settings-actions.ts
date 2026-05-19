"use server";

// Server Actions for Store Settings (contact info, etc.)

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Default contact settings
const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: "Four Seasons Fruits",
  store_slogan: "Hoa quả tươi ngon bốn mùa",
  phone: "0123 456 789",
  phone_2: "",
  email: "info@fourseasons.vn",
  address: "123 Đường Trái Cây, Quận 1, TP.HCM",
  working_hours_weekday: "7:00 - 21:00",
  working_hours_saturday: "7:00 - 22:00",
  working_hours_sunday: "8:00 - 20:00",
  facebook: "",
  instagram: "",
  zalo: "",
  google_map: "",
  google_map_embed: "",
};

/**
 * Get all store settings as a key-value object
 */
export async function getStoreSettings(): Promise<Record<string, string>> {
  const settings = await db.storeSetting.findMany();
  const result = { ...DEFAULT_SETTINGS };

  for (const setting of settings) {
    result[setting.key] = setting.value;
  }

  return result;
}

/**
 * Get a single setting value
 */
export async function getSetting(key: string): Promise<string> {
  const setting = await db.storeSetting.findUnique({ where: { key } });
  return setting?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(data: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(data)) {
      await db.storeSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    revalidatePath("/contact");
    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
