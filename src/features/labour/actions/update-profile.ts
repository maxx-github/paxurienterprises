// src/features/labour/actions/update-profile.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateFundiRates(formData: FormData) {
  try {
    const profileId = formData.get("profileId") as string;
    const dailyRate = parseFloat(formData.get("dailyRate") as string);
    const monthlyRateStr = formData.get("monthlyRate") as string;
    const monthlyRate = monthlyRateStr ? parseFloat(monthlyRateStr) : null;

    await prisma.labourProfile.update({
      where: { id: profileId },
      data: { dailyRate, monthlyRate },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update rates error:", error);
    return { success: false };
  }
}