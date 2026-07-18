// src/lib/email/index.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@paxurienterprises.com";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Paxuri Enterprises <onboarding@resend.dev>", // Use your verified domain in production
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

// --- TEMPLATES ---

export function getContactEmailTemplate(data: { name: string; email: string; phone: string; subject: string; message: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0056B3;">New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p><strong>Message:</strong></p>
      <p style="background: #f9f9f9; padding: 15px; border-radius: 4px;">${data.message}</p>
    </div>
  `;
}

export function getQuoteEmailTemplate(data: { fullName: string; email: string; phone: string; projectType: string; description: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #0056B3;">New Quotation Request</h2>
      <p><strong>Client:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Project Type:</strong> ${data.projectType}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p><strong>Description:</strong></p>
      <p style="background: #f9f9f9; padding: 15px; border-radius: 4px;">${data.description}</p>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Please log in to the Admin Dashboard to view attached documents.</p>
    </div>
  `;
}