// src/lib/storage/upload.ts
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

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

  // Validate file size (max 5MB for this example)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" is too large. Maximum size is 5MB.`);
  }

  // Generate a unique filename to prevent overwrites
  const fileExtension = file.name.split(".").pop();
  const uniqueFileName = `${folder}/${nanoid()}.${fileExtension}`;

  try {
    // Upload to Vercel Blob
    const blob = await put(uniqueFileName, file, {
      access: "public",
      addRandomSuffix: false, // We already added a unique suffix via nanoid
    });

    return blob.url;
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    throw new Error(`Failed to upload file: ${file.name}`);
  }
}