// src/features/projects/actions/delete-project.ts
"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, message: "Failed to delete project." };
  }
}