// src/features/catalogue/actions/delete-product.ts
"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin, forbiddenResult, unauthorizedResult } from "@/lib/auth-guards";

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();

    if (!id || typeof id !== "string") {
      return { success: false, message: "Invalid product id." };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/catalogue");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    if (error?.message === "FORBIDDEN") return forbiddenResult();
    console.error("Delete product error:", error);
    return { success: false, message: "Failed to delete product." };
  }
}