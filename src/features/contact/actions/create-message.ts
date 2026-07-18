"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createContactMessage(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return { success: false, message: "Name, Email, and Message are required." };
    }

    await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    return { success: true, message: "Message sent successfully! We will get back to you soon." };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Failed to send message. Please try again." };
  }
}