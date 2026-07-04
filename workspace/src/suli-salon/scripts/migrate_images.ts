import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Cloudinary config must be done after loading env vars
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageBuffer(fileBuffer: Buffer, folder: string = "duthuyensonghan"): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      )
      .end(fileBuffer);
  });
}

function getFilesRecursively(directory: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const stat = fs.statSync(path.join(directory, file));
    if (stat.isDirectory()) {
      getFilesRecursively(path.join(directory, file), fileList);
    } else {
      fileList.push(path.join(directory, file));
    }
  }
  return fileList;
}

async function main() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imagesDir)) {
    console.log("No public/images directory found.");
    return;
  }

  const allFiles = getFilesRecursively(imagesDir);
  const map: Record<string, string> = {};
  
  console.log(`Found ${allFiles.length} files. Starting migration to Cloudinary...`);
  let count = 0;

  for (const filePath of allFiles) {
    // Generate the local relative path as used in the code/DB: e.g., "/images/banner_desktop.webp"
    const relativePath = filePath.substring(process.cwd().length).replace(/\\/g, "/");
    const pubPath = relativePath.startsWith("/public/") ? relativePath.replace("/public", "") : relativePath;

    try {
      const buffer = fs.readFileSync(filePath);
      const url = await uploadImageBuffer(buffer, "duthuyensonghan");
      map[pubPath] = url;
      count++;
      console.log(`[${count}/${allFiles.length}] Uploaded: ${pubPath} -> ${url}`);
    } catch (e: any) {
      console.error(`Error uploading ${pubPath}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), "migration_map.json"), JSON.stringify(map, null, 2));
  console.log("Migration map saved to migration_map.json");
}

main().catch(console.error);
