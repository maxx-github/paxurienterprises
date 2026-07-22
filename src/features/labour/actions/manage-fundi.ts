// src/features/labour/actions/manage-fundi.ts
"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin, forbiddenResult, unauthorizedResult } from "@/lib/auth-guards";

export async function verifyFundi(id: string) {
  try {
    await requireAdmin();

    if (!id || typeof id !== "string") {
      return { success: false };
    }

    await prisma.labourProfile.update({
      where: { id },
      data: { isAvailable: true },
    });
    revalidatePath("/admin/fundis");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    if (error?.message === "FORBIDDEN") return forbiddenResult();
    return { success: false };
  }
}

export async function rejectFundi(id: string) {
  try {
    await requireAdmin();

    if (!id || typeof id !== "string") {
      return { success: false };
    }

    const profile = await prisma.labourProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (profile) {
      // Cascade delete profile via user relation where configured; delete both safely
      await prisma.$transaction([
        prisma.labourProfile.delete({ where: { id } }),
        prisma.user.delete({ where: { id: profile.userId } }),
      ]);
    }

    revalidatePath("/admin/fundis");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    if (error?.message === "FORBIDDEN") return forbiddenResult();
    return { success: false };
  }
}