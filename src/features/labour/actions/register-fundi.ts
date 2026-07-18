// src/features/labour/actions/register-fundi.ts
"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerFundi(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const nationalId = formData.get("nationalId") as string;
    const county = formData.get("county") as string;
    const skill = formData.get("skill") as any; // Matches SkillCategory enum
    const yearsExperience = parseInt(formData.get("yearsExperience") as string);
    const dailyRate = parseFloat(formData.get("dailyRate") as string);
    const monthlyRateStr = formData.get("monthlyRate") as string;
    const monthlyRate = monthlyRateStr ? parseFloat(monthlyRateStr) : null;
    
    // Using URL strings to perfectly match your Prisma schema
    const cvUrl = formData.get("cvUrl") as string;
    const photoUrl = formData.get("photoUrl") as string;
    const certUrlsRaw = formData.get("certUrls") as string;
    const certUrls = certUrlsRaw 
      ? certUrlsRaw.split(",").map((url: string) => url.trim()).filter(Boolean) 
      : [];

    if (!name || !email || !password || !skill || !nationalId || !county) {
      return { success: false, message: "Please fill in all required fields." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create User and LabourProfile in a single transaction
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          phone,
          role: "FUNDI",
        },
      });

      await tx.labourProfile.create({
        data: {
          userId: newUser.id,
          nationalId,
          county,
          skill,
          yearsExperience,
          dailyRate,
          monthlyRate,
          cvUrl,
          photoUrl,
          certUrls,
        },
      });
    });

    return { success: true, message: "Registration successful! You can now log in." };
  } catch (error: any) {
    console.error("Fundi registration error:", error);
    if (error.code === "P2002") {
      return { success: false, message: "A user with this email or National ID already exists." };
    }
    return { success: false, message: "Registration failed. Please check your inputs and try again." };
  }
}