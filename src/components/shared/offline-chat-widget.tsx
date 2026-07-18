// src/components/shared/offline-chat-widget.tsx
"use client";

import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { submitContactForm } from "@/features/services/actions/contact";

export function OfflineChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    // Append hidden fields for the server action
    formData.append("subject", "Live Chat Inquiry");
    
    // ✅ FIXED: Pass 'null' as the first argument (prevState) to satisfy the 2-argument requirement
    const result = await submitContactForm(null, formData);
    
    if (result.success) {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsOpen(false);
        // Optional: reset the form here if needed
        e.currentTarget.reset();
      }, 3000);
    }
    setIsPending(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-80 mb-4 shadow-xl border border-grey-dark animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">Paxuri Support</h3>
              <p className="text-xs text-primary-light">We'll get back to you shortly.</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-grey">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4">
            {isSent ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-dark">Message Sent!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input name="name" placeholder="Your Name" required className="h-9 text-sm" />
                <Input name="email" type="email" placeholder="Your Email" required className="h-9 text-sm" />
                <Input name="phone" placeholder="Phone Number" required className="h-9 text-sm" />
                <textarea 
                  name="message" 
                  placeholder="How can we help you?" 
                  required 
                  rows={3} 
                  className="flex w-full rounded-md border border-grey-dark bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
                <Button type="submit" variant="primary" size="sm" className="w-full" disabled={isPending}>
                  {isPending ? "Sending..." : <><Send className="mr-2 h-3 w-3" /> Send Message</>}
                </Button>
              </form>
            )}
          </div>
        </Card>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-dark text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300"
        aria-label="Open Chat"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>
    </div>
  );
}