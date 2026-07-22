// src/features/catalogue/actions/create-product.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { ProductCategory } from "@prisma/client";
import { requireAdmin, forbiddenResult, unauthorizedResult } from "@/lib/auth-guards";

const ALLOWED_CATEGORIES = new Set(Object.values(ProductCategory));

export async function createProduct(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const name = (formData.get("name") as string)?.trim();
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const description = (formData.get("description") as string)?.trim() || "";
    const imageFile = formData.get("image") as File;

    if (!name || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
      return { success: false, message: "Please fill in all required fields with valid numbers." };
    }

    if (!ALLOWED_CATEGORIES.has(category as ProductCategory)) {
      return { success: false, message: "Invalid product category." };
    }

    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageFile.type)) {
        return { success: false, message: "Invalid file type. Only JPG, PNG, and WEBP are allowed." };
      }

      const maxSize = 5 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        return { success: false, message: "File size exceeds the 5MB limit." };
      }

      const sanitizedName = imageFile.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
      const fileName = `${Date.now()}-${sanitizedName}`;

      const blob = await put(`products/${fileName}`, imageFile, {
        access: "public",
      });

      imageUrl = blob.url;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    await prisma.product.create({
      data: {
        name,
        slug,
        category: category as ProductCategory,
        price,
        stock,
        description,
        images: imageUrl ? [imageUrl] : [],
        isAvailable: true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
    return { success: true, message: "Product created successfully!" };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    if (error?.message === "FORBIDDEN") return forbiddenResult();

    console.error("CREATE PRODUCT ERROR:", error);

    if (error.code === "P2002") {
      return { success: false, message: "A product with this exact name already exists." };
    }

    return { success: false, message: "Failed to create product. Please try again." };
  }
}