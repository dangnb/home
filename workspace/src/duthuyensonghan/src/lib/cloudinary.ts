// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
    fileBuffer: Buffer,
    folder: string = "duthuyensonghan"
): Promise<string> {
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

export async function deleteImage(url: string): Promise<boolean> {
    if (!url || !url.includes("cloudinary.com")) return false;
    
    try {
        const parts = url.split("/upload/");
        if (parts.length !== 2) return false;
        
        let path = parts[1];
        if (path.match(/^v\d+\//)) {
            path = path.replace(/^v\d+\//, "");
        }
        
        const lastDotIndex = path.lastIndexOf(".");
        const publicId = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
        
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted Cloudinary image:", publicId, result);
        return result.result === "ok";
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return false;
    }
}

export async function deleteImages(urls: string[]): Promise<void> {
    const uniqueUrls = Array.from(new Set(urls.filter(url => url && url.includes("cloudinary.com"))));
    await Promise.all(uniqueUrls.map(url => deleteImage(url)));
}

export function extractCloudinaryUrls(text?: string | null): string[] {
    if (!text) return [];
    const regex = /https?:\/\/res\.cloudinary\.com\/[^\s"'<>]+/g;
    const matches = text.match(regex);
    return matches ? Array.from(new Set(matches)) : [];
}

