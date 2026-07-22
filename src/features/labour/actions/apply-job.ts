// src/features/labour/actions/apply-job.ts
"use server";

import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/storage/upload";
import { revalidatePath } from "next/cache";
import { requireAuth, unauthorizedResult } from "@/lib/auth-guards";

export async function applyForJob(jobId: string, formData: FormData) {
  try {
    const user = await requireAuth();

    if (!jobId || typeof jobId !== "string") {
      return { success: false, message: "Invalid job." };
    }

    const expectedRate = parseFloat(formData.get("expectedRate") as string);
    const coverLetter = (formData.get("coverLetter") as string)?.trim() || "";

    if (isNaN(expectedRate) || expectedRate < 0) {
      return { success: false, message: "Please enter a valid expected rate." };
    }

    // Always use the authenticated user's labour profile — never trust form email
    const profile = await prisma.labourProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return {
        success: false,
        message: "No Fundi profile found for your account. Please register as a Fundi first.",
      };
    }

    const job = await prisma.jobPost.findFirst({
      where: { id: jobId, isActive: true },
      select: { id: true },
    });
    if (!job) {
      return { success: false, message: "This job is no longer available." };
    }

    // Optional CV upload
    const cvFile = formData.get("cv") as File;
    if (cvFile && cvFile.size > 0) {
      await uploadFile(cvFile, "applications/cv");
    }

    await prisma.jobApplication.create({
      data: {
        jobId,
        labourProfileId: profile.id,
        expectedRate,
        coverLetterUrl: coverLetter,
        status: "PENDING",
      },
    });

    revalidatePath(`/admin/jobs/${jobId}/applications`);
    return { success: true, message: "Application submitted successfully!" };
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return unauthorizedResult();
    console.error("Job Application Error:", error);
    return { success: false, message: "Failed to submit application." };
  }
}