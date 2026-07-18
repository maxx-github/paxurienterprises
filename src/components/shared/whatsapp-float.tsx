// src/components/shared/whatsapp-float.tsx
"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  // Replace with your actual Paxuri WhatsApp number
  const phoneNumber = "254717883488"; 
  const message = "Hello Paxuri Enterprises, I would like to inquire about your services.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}