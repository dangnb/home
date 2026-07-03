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
