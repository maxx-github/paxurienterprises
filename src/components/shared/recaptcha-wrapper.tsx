// src/components/shared/recaptcha-wrapper.tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReCaptchaWrapperProps {
  onVerify: (token: string) => void;
  action: string; // e.g., 'submit_contact', 'submit_quote', 'register_client'
  children: React.ReactNode;
}

export function ReCaptchaWrapper({ onVerify, action, children }: ReCaptchaWrapperProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    // Poll for grecaptcha to be ready, then execute
    const checkRecaptcha = setInterval(() => {
      if (window.grecaptcha) {
        clearInterval(checkRecaptcha);
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then((token) => {
            onVerify(token);
          });
        });
      }
    }, 500);

    return () => clearInterval(checkRecaptcha);
  }, [action, siteKey, onVerify]);

  if (!siteKey) {
    // Fallback if site key is missing in dev environment
    return <>{children}</>;
  }

  return (
    <>
      <Script 
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} 
        strategy="afterInteractive" 
      />
      {children}
    </>
  );
}