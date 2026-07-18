// src/features/labour/actions/manage-fundi.ts
"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function verifyFundi(id: string) {
  try {
    await prisma.labourProfile.update({
      where: { id },
      data: { isAvailable: true } // Sets status to Verified/Published
    });
    revalidatePath("/admin/fundis");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function rejectFundi(id: string) {
  try {
    const profile = await prisma.labourProfile.findUnique({ where: { id }, select: { userId: true } });
    if (profile) {
      await prisma.labourProfile.delete({ where: { id } });
      await prisma.user.delete({ where: { id: profile.userId } });
    }
    revalidatePath("/admin/fundis");
    return { success: true };
  } catch {
    return { success: false };
  }
}