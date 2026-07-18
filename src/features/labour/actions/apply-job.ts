// src/features/labour/actions/apply-job.ts
"use server";

import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/storage/upload";
import { revalidatePath } from "next/cache";

export async function applyForJob(jobId: string, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const expectedRate = parseFloat(formData.get("expectedRate") as string);
    const coverLetter = formData.get("coverLetter") as string;

    // Find the labour profile by email (assuming they registered first)
    const profile = await prisma.labourProfile.findFirst({
      where: { user: { email } },
    });

    if (!profile) {
      return { success: false, message: "No registered Fundi profile found for this email. Please register first." };
    }

    // Handle optional file uploads
    const cvFile = formData.get("cv") as File;
    const cvUrl = cvFile && cvFile.size > 0 ? await uploadFile(cvFile, "applications/cv") : profile.cvUrl;

    // Create the application
    await prisma.jobApplication.create({
      data: {
        jobId,
        labourProfileId: profile.id,
        expectedRate,
        coverLetterUrl: coverLetter || "", // Storing text as URL placeholder for simplicity, or save to a text field in production
        status: "PENDING",
      },
    });

    revalidatePath(`/admin/jobs/${jobId}/applications`);
    return { success: true, message: "Application submitted successfully!" };
  } catch (error: any) {
    console.error("Job Application Error:", error);
    return { success: false, message: "Failed to submit application." };
  }
}