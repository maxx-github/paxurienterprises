// src/app/(auth)/register/page.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HardHat, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReCaptchaWrapper } from "@/components/shared/recaptcha-wrapper";
import { registerClient } from "@/features/auth/actions/register-client"; // Add this import at the top

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

const handleSubmit = (formData: FormData) => {
  formData.append("recaptchaToken", recaptchaToken);

  startTransition(async () => {
    const result = await registerClient(formData);
    setStatus({ type: result.success ? "success" : "error", message: result.message });
    
    if (result.success) {
      setTimeout(() => router.push("/login"), 2000);
    }
  });
};

  return (
    <div className="min-h-screen bg-grey flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <HardHat className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading font-bold text-dark">Create Client Account</CardTitle>
          <p className="text-sm text-gray-500">Join Paxuri Enterprises to track orders and quotes</p>
        </CardHeader>
        
        <CardContent>
          {status.type === "success" ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-dark mb-1">Registration Successful!</h3>
              <p className="text-sm text-gray-600">{status.message}</p>
            </div>
          ) : (
            <ReCaptchaWrapper action="register_client" onVerify={setRecaptchaToken}>
              <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark">Full Name *</label>
                  <Input name="name" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark">Email Address *</label>
                  <Input name="email" type="email" placeholder="john@example.com" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark">Phone Number *</label>
                  <Input name="phone" type="tel" placeholder="0712345678" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark">Password *</label>
                  <div className="relative">
                    <Input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      minLength={8}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark">Confirm Password *</label>
                  <Input name="confirmPassword" type="password" placeholder="••••••••" required />
                </div>

                {status.type === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    <AlertCircle className="h-4 w-4" /> {status.message}
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
                </Button>

                <p className="text-center text-sm text-gray-500 pt-4 border-t border-grey-dark">
                  Already have an account? <Link href="/login" className="text-primary hover:underline font-semibold">Sign In</Link>
                </p>
                
                <p className="text-center text-xs text-gray-400">
                  Are you a skilled worker? <Link href="/register-fundi" className="text-primary hover:underline">Register as a Fundi here</Link>
                </p>
              </form>
            </ReCaptchaWrapper>
          )}
        </CardContent>
      </Card>
    </div>
  );
}