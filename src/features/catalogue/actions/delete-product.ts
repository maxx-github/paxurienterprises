// src/features/catalogue/actions/delete-product.ts
"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, message: "Failed to delete product." };
  }
}