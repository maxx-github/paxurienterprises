// src/app/(marketing)/contact/page.tsx
"use client";

import { useFormState } from "react-dom";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { submitContactForm } from "@/features/services/actions/contact";

export default function ContactPage() {
  // useFormState automatically handles passing FormData and managing pending/success states
  const [state, formAction, isPending] = useFormState(submitContactForm, null);

  return (
    <div className="min-h-screen bg-grey py-16 md:py-24">
      <div className="content-wrapper px-4 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-dark mb-4">Get In Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have a question or ready to start your project? Reach out to our team today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-dark">Our Location</h3>
                  <p className="text-gray-600 text-sm">Mombasa, Kenya</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-dark">Phone & WhatsApp</h3>
                  <p className="text-gray-600 text-sm">+254 717 883 488</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-dark">Email Us</h3>
                  <p className="text-gray-600 text-sm">info@paxurienterprises.com</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-dark">Working Hours</h3>
                  <p className="text-gray-600 text-sm">Mon - Fri: 8:00 AM - 5:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                {state?.success ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-dark mb-2">Message Sent!</h2>
                    <p className="text-gray-600">{state.message}</p>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1">Full Name *</label>
                        <Input name="name" required placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1">Phone Number *</label>
                        <Input name="phone" type="tel" required placeholder="+254 7XX XXX XXX" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Email Address *</label>
                      <Input name="email" type="email" required placeholder="you@example.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Subject *</label>
                      <Input name="subject" required placeholder="How can we help?" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Message *</label>
                      <textarea 
                        name="message" 
                        rows={5} 
                        required 
                        placeholder="Tell us about your project or inquiry..."
                        className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                      />
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
                      {isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}