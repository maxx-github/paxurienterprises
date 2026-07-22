"use server";

import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const category = formData.get("category") as "CONSTRUCTION_MATERIALS" | "FINISHING_MATERIALS";
  const description = formData.get("description") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;
  
  // Get all files from the input named "images"
  const imageFiles = formData.getAll("images") as File[]; 

  // 1. Upload images to Vercel Blob and collect URLs
  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    if (file.size > 0) {
      const blob = await put(`products/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      imageUrls.push(blob.url);
    }
  }

  // 2. Generate a URL-friendly slug
  const slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  // 3. Save to Database (images is saved as a String[])
  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      category,
      stock,
      isAvailable: true,
      images: imageUrls, // <-- Saves directly to the String[] column
    },
  });

  // 4. Refresh the catalogue page so the new product appears immediately
  revalidatePath("/catalogue");
  
  return { success: true };
}