// src/app/(projects)/request-quote/page.tsx
"use client";

import { useFormState } from "react-dom";
import { FileText, CheckCircle2, AlertCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { requestQuote } from "@/features/services/actions/request-quote";

export default function RequestQuotePage() {
  // useFormState automatically handles passing FormData and managing pending/success states
  const [state, formAction, isPending] = useFormState(requestQuote, null);

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Request a Quotation</h1>
          <p className="text-gray-600 text-lg">Tell us about your project. Provide links to your BOQs or drawings for an accurate estimate.</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            {state?.success ? (
              <div className="text-center py-10">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-dark mb-2">Request Received!</h2>
                <p className="text-gray-600">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Full Name *</label>
                    <Input name="fullName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Company Name (Optional)</label>
                    <Input name="companyName" placeholder="Your Company Ltd" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Phone Number *</label>
                    <Input name="phone" type="tel" placeholder="0712345678" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Email Address *</label>
                    <Input name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Project Location *</label>
                    <Input name="location" placeholder="e.g., Mombasa, Kenya" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Project Type *</label>
                    <select name="projectType" required className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Project Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Finishing">Finishing Only</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Estimated Budget (KES)</label>
                    <Input name="budget" placeholder="e.g., 500,000" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-dark">Preferred Start Date</label>
                    <Input name="startDate" type="date" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-dark mb-1">Project Description *</label>
                  <textarea 
                    name="description" 
                    rows={5} 
                    required 
                    className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y" 
                    placeholder="Describe your project requirements, scope of work, and any specific materials needed..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-dark mb-2 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-primary" /> Document Links (BOQs / Drawings)
                  </label>
                  <Input 
                    name="attachments" 
                    type="text" 
                    placeholder="https://drive.google.com/..., https://dropbox.com/..." 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    To ensure reliable storage, please provide public links (e.g., Google Drive, Dropbox) to your documents, separated by commas.
                  </p>
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
                  {isPending ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}