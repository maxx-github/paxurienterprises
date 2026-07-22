"use server";

import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const category = formData.get("category") as "CONSTRUCTION_MATERIALS" | "FINISHING_MATERIALS";
    const description = (formData.get("description") as string) || "";
    const stock = parseInt(formData.get("stock") as string) || 0;
    
    // Get all files from the input named "images"
    const imageFiles = formData.getAll("images") as File[]; 

    if (!name || !category) {
      return { success: false, message: "Product name and category are required." };
    }

    // 1. Upload images to Vercel Blob
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size > 0) {
        // Enforce the 5MB limit stated in the UI
        if (file.size > 5 * 1024 * 1024) {
          return { success: false, message: `File "${file.name}" exceeds the 5MB limit.` };
        }
        
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
        images: imageUrls, 
      },
    });

    // 4. Refresh the caches so the new product appears immediately
    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
    
    return { success: true, message: "Product created successfully!" };
    
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}