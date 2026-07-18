// src/app/(labour)/jobs/[id]/apply/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { applyForJob } from "@/features/labour/actions/apply-job";

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await applyForJob(jobId, formData);
      setStatus({ type: result.success ? "success" : "error", message: result.message });
      if (result.success) setTimeout(() => router.push("/jobs"), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-grey py-12 md:py-20">
      <div className="content-wrapper max-w-3xl">
        <div className="text-center mb-10">
          <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-heading font-bold text-dark mb-2">Apply for this Position</h1>
          <p className="text-gray-600">Please ensure you are a registered Fundi. Fill in the details below to submit your application.</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            {status.type === "success" ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark mb-2">Application Sent!</h2>
                <p className="text-gray-600">{status.message}</p>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Registered Email *</label>
                    <Input name="email" type="email" required placeholder="fundi@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Expected Rate (KES) *</label>
                    <Input name="expectedRate" type="number" required min="0" placeholder="e.g., 2000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Cover Letter / Notes</label>
                  <textarea name="coverLetter" rows={4} className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Why are you the best fit for this role?"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Update CV (Optional)</label>
                  <Input name="cv" type="file" accept=".pdf,.doc,.docx" />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to use your registered CV.</p>
                </div>

                {status.type === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    <AlertCircle className="h-4 w-4" /> {status.message}
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}