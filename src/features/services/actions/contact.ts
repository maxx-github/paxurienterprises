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

    if (name.length > 200 || email.length > 320 || phone.length > 40 || subject.length > 300 || message.length > 5000) {
      return { success: false, message: "One or more fields exceed the maximum allowed length." };
    }

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return { success: true, message: "Your message has been sent successfully. We will get back to you soon!" };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}