// src/app/(shop)/checkout/page.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Smartphone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/features/ecommerce/store/use-cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const deliveryAddress = formData.get("deliveryAddress") as string;
    const county = formData.get("county") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const mpesaPhone = formData.get("mpesaPhone") as string;

    if (!deliveryAddress || !county || !contactPhone || !mpesaPhone) {
      setStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      setStatus("idle");
      try {
        const response = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: mpesaPhone,
            deliveryAddress,
            county,
            contactPhone,
            items,
            totalAmount: totalPrice(),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          clearCart();
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to initiate payment.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  if (items.length === 0 && status !== "success") {
    return (
      <section className="py-20 bg-grey min-h-screen flex items-center">
        <div className="content-wrapper text-center">
          <h1 className="text-3xl font-heading font-bold text-dark mb-4">Your Cart is Empty</h1>
          <Button variant="primary" asChild><Link href="/catalogue">Browse Catalogue</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-grey min-h-screen">
      <div className="content-wrapper max-w-5xl">
        <Link href="/cart" className="inline-flex items-center text-primary hover:underline mb-8 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                {status === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-dark mb-2">STK Push Sent!</h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <p className="text-sm text-gray-500 mb-8">
                      Please enter your M-Pesa PIN on your phone to complete the payment.
                    </p>
                    <Button variant="primary" onClick={() => router.push("/")}>Return to Home</Button>
                  </div>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-8">
                    {/* Delivery Details */}
                    <div>
                      <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" /> Delivery Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-dark mb-1">Delivery Address / Location *</label>
                          <Input name="deliveryAddress" required placeholder="e.g., 123 Moi Avenue, Nairobi CBD" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">County *</label>
                          <select name="county" required className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Select County</option>
                            <option value="Nairobi">Nairobi</option>
                            <option value="Kiambu">Kiambu</option>
                            <option value="Kajiado">Kajiado</option>
                            <option value="Machakos">Machakos</option>
                            <option value="Mombasa">Mombasa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">Contact Phone *</label>
                          <Input name="contactPhone" type="tel" required placeholder="0712345678" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-grey-dark pt-6">
                      {/* M-Pesa Payment */}
                      <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-primary" /> M-Pesa Payment
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1">M-Pesa Phone Number *</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="tel"
                            name="mpesaPhone"
                            placeholder="0712345678 or 254712345678"
                            className="pl-10"
                            disabled={isPending}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Ensure the number is registered to M-Pesa and has sufficient funds.
                        </p>
                      </div>
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        <AlertCircle className="h-4 w-4" /> {message}
                      </div>
                    )}

                    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
                      {isPending ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                      ) : (
                        `Pay KES ${totalPrice().toLocaleString()} via M-Pesa`
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate w-2/3">
                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-dark">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-grey-dark pt-4 flex justify-between text-lg font-bold text-dark">
                  <span>Total</span>
                  <span className="text-primary">KES {totalPrice().toLocaleString()}</span>
                </div>
                
                <div className="mt-6 p-4 bg-primary-light rounded-lg">
                  <p className="text-xs text-primary leading-relaxed">
                    <strong>How it works:</strong> Click "Pay" and an M-Pesa prompt will be sent to your phone. 
                    Enter your PIN to authorize the payment. Your hardware will be dispatched to the delivery address provided.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}