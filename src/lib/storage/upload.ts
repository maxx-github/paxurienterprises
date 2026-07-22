// src/lib/storage/upload.ts
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

const SAFE_FOLDER = /^[a-z0-9/_-]+$/i;

/**
 * Uploads a file to Vercel Blob storage.
 * @param file - The File object from the FormData
 * @param folder - The folder path in the blob storage (e.g., "fundis/cv", "products")
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("No file provided");
  }

  if (!folder || !SAFE_FOLDER.test(folder) || folder.includes("..")) {
    throw new Error("Invalid upload folder");
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" is too large. Maximum size is 5MB.`);
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Invalid file type. Allowed: JPG, PNG, WEBP, PDF.");
  }

  // Use MIME-derived extension only — never trust client-provided extension
  const fileExtension = MIME_TO_EXT[file.type] || "bin";
  const uniqueFileName = `${folder}/${nanoid()}.${fileExtension}`;

  try {
    const blob = await put(uniqueFileName, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });

    return blob.url;
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    throw new Error("Failed to upload file.");
  }
}
