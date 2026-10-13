const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFile(filePath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: "moc-salon",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
  });
}

async function main() {
  const uploadsDir = path.join(__dirname, "..", "public", "uploads");
  const files = [
    { file: "banner.png", id: "banner" },
    { file: "nails_art.png", id: "nails_art" },
    { file: "pedicure.png", id: "pedicure" },
    { file: "team.png", id: "team" },
  ];

  const results = {};
  for (const item of files) {
    const fullPath = path.join(uploadsDir, item.file);
    if (fs.existsSync(fullPath)) {
      console.log(`Uploading ${item.file}...`);
      const url = await uploadFile(fullPath, item.id);
      results[item.file] = url;
      console.log(`Uploaded ${item.file} -> ${url}`);
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  }

  const outPath = path.join(__dirname, "..", "uploaded_salon_images.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");
  console.log("Saved results to uploaded_salon_images.json");
}

main().catch((err) => {
  console.error("Upload error:", err);
  process.exit(1);
});
