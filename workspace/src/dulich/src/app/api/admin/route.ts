import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerAdminSession } from "@/lib/adminAuth";

const dataDir = path.join(process.cwd(), "data");

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`Error reading ${filename}:`, err);
  }
  return fallback;
}

function writeJsonFile(filename: string, data: unknown): boolean {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

export async function GET() {
  const session = await getServerAdminSession();
  const tours = readJsonFile("tours.json", []);
  const categories = readJsonFile("categories.json", []);
  const journal = readJsonFile("journal.json", []);
  const settings = readJsonFile("settings.json", {});
  const media = readJsonFile("media.json", {
    heroSlides: [],
    destinations: [],
    postcards: [],
  });

  if (!session.authenticated) {
    return NextResponse.json({
      tours,
      categories,
      journal,
      settings,
      media,
      bookings: [],
      contacts: [],
    });
  }

  const bookings = readJsonFile("bookings.json", []);
  const contacts = readJsonFile("contacts.json", []);

  return NextResponse.json({
    tours,
    categories,
    journal,
    bookings,
    contacts,
    settings,
    media,
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerAdminSession();
    if (!session.authenticated) {
      return NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { entity, data } = body as {
      entity:
        | "tours"
        | "journal"
        | "bookings"
        | "contacts"
        | "settings"
        | "media";
      data: unknown;
    };

    const allowedFiles: Record<string, string> = {
      tours: "tours.json",
      journal: "journal.json",
      bookings: "bookings.json",
      contacts: "contacts.json",
      settings: "settings.json",
      media: "media.json",
    };

    const filename = allowedFiles[entity];
    if (!filename) {
      return NextResponse.json(
        { error: "Danh mục dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const ok = writeJsonFile(filename, data);
    if (!ok) {
      return NextResponse.json(
        { error: "Không thể lưu dữ liệu xuống tệp hệ thống." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã lưu thay đổi thành công.",
    });
  } catch (err) {
    console.error("Admin API POST error:", err);
    return NextResponse.json(
      { error: "Lỗi xử lý dữ liệu quản trị." },
      { status: 500 }
    );
  }
}
