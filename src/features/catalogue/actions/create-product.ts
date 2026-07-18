// src/features/catalogue/actions/create-product.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { ProductCategory } from "@prisma/client"; // ✅ 1. IMPORT THE ENUM

// ✅ CRITICAL FIX: 'prevState' MUST be the first argument when using useFormState
export async function createProduct(prevState: any, formData: FormData) {
  try {
    // 1. Extract data from FormData
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    // 2. Basic Validation
    if (!name || isNaN(price) || isNaN(stock)) {
      return { success: false, message: "Please fill in all required fields with valid numbers." };
    }

    let imageUrl = "";

    // 3. Handle Image Upload (if a file was provided)
    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageFile.type)) {
        return { success: false, message: `Invalid file type: ${imageFile.type}. Only JPG, PNG, and WEBP are allowed.` };
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        return { success: false, message: `File size is ${(imageFile.size / 1024 / 1024).toFixed(2)}MB. Max allowed is 5MB.` };
      }

      // Sanitize filename (fixes issues with spaces/commas in filenames)
      const sanitizedName = imageFile.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      
      const fileName = `${Date.now()}-${sanitizedName}`;
      console.log(`[UPLOAD] Starting upload for: ${fileName}`);

      // Upload to Vercel Blob
      const blob = await put(`products/${fileName}`, imageFile, {
        access: "public",
      });
      
      imageUrl = blob.url;
      console.log(`[UPLOAD] Success! URL: ${imageUrl}`);
    }

    // 4. Generate Slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // 5. Save to Database
    await prisma.product.create({
      data: {
        name,
        slug,
        // ✅ 2. CAST THE STRING TO THE PRISMA ENUM TYPE
        category: category as ProductCategory, 
        price,
        stock,
        description,
        images: imageUrl ? [imageUrl] : [],
        isAvailable: true,
      },
    });

    // 6. Revalidate and Return Success
    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
    return { success: true, message: "Product created successfully!" };
    
  } catch (error: any) {
    console.error("========================================");
    console.error("CREATE PRODUCT ERROR DETAILS:");
    console.error(error);
    console.error("========================================");

    if (error.code === 'P2002') {
      return { success: false, message: "A product with this exact name already exists." };
    }
    
    return { success: false, message: `Server Error: ${error.message || "Unknown error occurred"}` };
  }
}