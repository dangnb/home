import { unlink } from "fs/promises";
import path from "path";

/**
 * Extract all local upload image URLs from HTML content
 */
export function extractUploadedImages(html: string): string[] {
  const regex = /src="(\/uploads\/[^"]+)"/g;
  const images: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    images.push(match[1]);
  }
  return images;
}

/**
 * Delete uploaded image files from disk
 */
export async function deleteUploadedImages(imageUrls: string[]): Promise<void> {
  for (const url of imageUrls) {
    // Only delete local uploads (starts with /uploads/)
    if (!url.startsWith("/uploads/")) continue;

    const filePath = path.join(process.cwd(), "public", url);
    try {
      await unlink(filePath);
      console.log(`Deleted image: ${url}`);
    } catch (err) {
      // File might not exist, ignore
      console.warn(`Could not delete image: ${url}`, err);
    }
  }
}

/**
 * Compare old and new content, delete images that were removed
 */
export async function cleanupRemovedImages(
  oldContent: string,
  newContent: string,
  oldThumbnail?: string | null,
  newThumbnail?: string | null
): Promise<void> {
  const oldImages = extractUploadedImages(oldContent);
  const newImages = extractUploadedImages(newContent);

  // Find images that exist in old but not in new (removed)
  const removedImages = oldImages.filter((img) => !newImages.includes(img));

  // Check thumbnail change
  if (oldThumbnail && oldThumbnail.startsWith("/uploads/") && oldThumbnail !== newThumbnail) {
    removedImages.push(oldThumbnail);
  }

  if (removedImages.length > 0) {
    await deleteUploadedImages(removedImages);
  }
}

/**
 * Delete all images from a post (used when deleting a post)
 */
export async function deleteAllPostImages(
  content: string,
  thumbnail?: string | null
): Promise<void> {
  const images = extractUploadedImages(content);

  if (thumbnail && thumbnail.startsWith("/uploads/")) {
    images.push(thumbnail);
  }

  if (images.length > 0) {
    await deleteUploadedImages(images);
  }
}
