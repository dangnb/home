// API Route: File Upload
// Saves files locally to /public/uploads for now
// Easy to swap out for cloud storage (S3, Cloudinary, etc.) later

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Upload directory - change this to cloud storage later
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Allowed image types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const uploadedFiles: { url: string; name: string; size: number }[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.type}` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name} (max 5MB)` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const ext = path.extname(file.name) || ".jpg";
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}-${randomStr}${ext}`;

      // Write file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filepath = path.join(UPLOAD_DIR, filename);
      await writeFile(filepath, buffer);

      // Return the public URL
      uploadedFiles.push({
        url: `/uploads/${filename}`,
        name: file.name,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
