// src/features/auth/actions/register-client.ts
"use server";

import { prisma } from "@/lib/db";
import { verifyRecaptcha } from "@/lib/utils/verify-recaptcha";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerClient(formData: FormData) {
  try {
    // 1. Verify reCAPTCHA
    const recaptchaToken = formData.get("recaptchaToken") as string;
    const isHuman = await verifyRecaptcha(recaptchaToken);
    
    if (!isHuman) {
      return { success: false, message: "Spam detected. Please try again." };
    }

    // 2. Extract and Validate Data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !phone || !password) {
      return { success: false, message: "All required fields must be filled." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long." };
    }

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create User in Database
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        role: "CLIENT",
      },
    });

    // TODO: Send welcome email to the client here

    revalidatePath("/admin/dashboard"); // If admin is viewing users
    return { success: true, message: "Account created successfully! Please log in." };
    
  } catch (error: any) {
    console.error("Client Registration Error:", error);
    return { success: false, message: "An error occurred. Please try again later." };
  }
}