// src/features/services/actions/contact.ts
"use server";

import { prisma } from "@/lib/db";

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Basic validation
    if (!name || !phone || !email || !subject || !message) {
      return { success: false, message: "Please fill in all required fields." };
    }

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    return { success: true, message: "Your message has been sent successfully. We will get back to you soon!" };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}