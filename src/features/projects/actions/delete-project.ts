// src/features/projects/actions/delete-project.ts
"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin, forbiddenResult, unauthorizedResult } from "@/lib/auth-guards";

export async function deleteProject(id: string) {
  try {
    await requireAdmin();

    if (!id || typeof id !== "string") {
      return { success: false, message: "Invalid project id." };
    }

    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/portfolio");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    if (error?.message === "FORBIDDEN") return forbiddenResult();
    console.error("Delete project error:", error);
    return { success: false, message: "Failed to delete project." };
  }
}