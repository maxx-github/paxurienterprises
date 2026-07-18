// src/features/services/actions/request-quote.ts
"use server";

import { prisma } from "@/lib/db";

export async function requestQuote(prevState: any, formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const companyName = formData.get("companyName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const location = formData.get("location") as string;
    const projectType = formData.get("projectType") as string;
    const budget = formData.get("budget") as string;
    const startDateStr = formData.get("startDate") as string;
    const description = formData.get("description") as string;
    const attachmentsRaw = formData.get("attachments") as string;

    // Basic validation
    if (!fullName || !phone || !email || !location || !projectType || !description) {
      return { success: false, message: "Please fill in all required fields." };
    }

    // Parse optional fields safely
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    
    // Handle attachments as comma-separated URLs to match the String[] schema robustly
    const attachments = attachmentsRaw 
      ? attachmentsRaw.split(",").map((url: string) => url.trim()).filter(Boolean) 
      : [];

    // Save to database
    await prisma.quoteRequest.create({
      data: {
        fullName,
        companyName: companyName || undefined,
        phone,
        email,
        location,
        projectType,
        budget: budget || undefined,
        startDate,
        description,
        attachments,
      },
    });

    return { success: true, message: "Your quote request has been submitted successfully. Our team will review it and get back to you shortly." };
  } catch (error) {
    console.error("Quote request error:", error);
    return { success: false, message: "Failed to submit quote request. Please try again later." };
  }
}