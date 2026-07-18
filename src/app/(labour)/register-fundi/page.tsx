// src/app/(labour)/register-fundi/page.tsx
"use client";

import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Link2, User, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { registerFundi } from "@/features/labour/actions/register-fundi";
import { SkillCategory } from "@prisma/client";

export default function RegisterFundiPage() {
  const router = useRouter();
  // useFormState automatically handles passing FormData and managing pending/success states
  const [state, formAction, isPending] = useFormState(registerFundi, null);

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Register as a Fundi</h1>
          <p className="text-gray-600 text-lg">Join our network of skilled professionals and get matched with top construction projects.</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            {state?.success ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark mb-2">Registration Successful!</h2>
                <p className="text-gray-600 mb-6">{state.message}</p>
                <Button variant="primary" onClick={() => router.push("/login")}>
                  Proceed to Login
                </Button>
              </div>
            ) : (
              <form action={formAction} className="space-y-8">
                {/* Personal Details */}
                <div>
                  <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Full Name *</label>
                      <Input name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Email Address *</label>
                      <Input name="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Password *</label>
                      <Input name="password" type="password" placeholder="Create a secure password" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Phone Number *</label>
                      <Input name="phone" type="tel" placeholder="0712345678" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">National ID Number *</label>
                      <Input name="nationalId" placeholder="12345678" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">County of Residence *</label>
                      <Input name="county" placeholder="e.g., Mombasa" required />
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div>
                  <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" /> Professional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Skill Category *</label>
                      <select name="skill" required className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Select Skill Category</option>
                        {Object.values(SkillCategory).map((skill) => (
                          <option key={skill} value={skill}>
                            {skill.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Years of Experience *</label>
                      <Input name="yearsExperience" type="number" placeholder="e.g., 5" required min="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Expected Daily Rate (KES) *</label>
                      <Input name="dailyRate" type="number" placeholder="e.g., 2500" required min="0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Expected Monthly Rate (KES) (Optional)</label>
                      <Input name="monthlyRate" type="number" placeholder="e.g., 50000" min="0" />
                    </div>
                  </div>
                </div>

                {/* Document Links */}
                <div>
                  <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-primary" /> Document Links
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    To ensure reliable storage, please provide public links (e.g., Google Drive, Dropbox, or Imgur) to your documents.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">CV / Resume Link (PDF) *</label>
                      <Input name="cvUrl" type="url" placeholder="https://..." required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-dark">Passport Photo Link *</label>
                      <Input name="photoUrl" type="url" placeholder="https://..." required />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-dark">Certification Links (Comma separated)</label>
                      <Input name="certUrls" type="text" placeholder="https://cert1.com, https://cert2.com" />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {state && !state.success && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" /> 
                    <span>{state.message}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}