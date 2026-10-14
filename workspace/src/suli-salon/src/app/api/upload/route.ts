import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json({ error: "Không tìm thấy tệp ảnh hợp lệ" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: "Ảnh không được vượt quá 5 MB" }, { status: 413 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP" }, { status: 415 });
    }

    const source = Buffer.from(await file.arrayBuffer());
    let imageBuffer: Buffer;
    try {
      imageBuffer = await sharp(source, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    } catch {
      return NextResponse.json({ error: "Tệp tải lên không phải ảnh hợp lệ" }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      const fs = await import("fs/promises");
      const path = await import("path");
      const filename = `upload_${Date.now()}_${crypto.randomUUID()}.webp`;
      const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), imageBuffer);
      return NextResponse.json({ url: `/images/uploads/${filename}` });
    }

    const url = await uploadImage(imageBuffer);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
