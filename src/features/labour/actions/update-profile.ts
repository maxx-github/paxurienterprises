// src/features/labour/actions/update-profile.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth, unauthorizedResult, forbiddenResult } from "@/lib/auth-guards";

export async function updateFundiRates(formData: FormData) {
  try {
    const user = await requireAuth();

    const profileId = formData.get("profileId") as string;
    const dailyRate = parseFloat(formData.get("dailyRate") as string);
    const monthlyRateStr = formData.get("monthlyRate") as string;
    const monthlyRate = monthlyRateStr ? parseFloat(monthlyRateStr) : null;

    if (!profileId || isNaN(dailyRate) || dailyRate < 0) {
      return { success: false, message: "Invalid rate values." };
    }

    if (monthlyRate !== null && (isNaN(monthlyRate) || monthlyRate < 0)) {
      return { success: false, message: "Invalid monthly rate." };
    }

    const profile = await prisma.labourProfile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });

    // Only the owning fundi (or an admin) may update rates
    if (!profile) {
      return { success: false, message: "Profile not found." };
    }
    if (user.role !== "ADMIN" && profile.userId !== user.id) {
      return forbiddenResult();
    }

    await prisma.labourProfile.update({
      where: { id: profileId },
      data: { dailyRate, monthlyRate },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    console.error("Update rates error:", error);
    return { success: false };
  }
}