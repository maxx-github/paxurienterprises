// src/app/(shop)/order-success/page.tsx
import Link from "next/link";
import { CheckCircle2, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";

interface OrderSuccessPageProps {
  searchParams: { orderId?: string };
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const orderId = searchParams.orderId;
  let order = null;

  if (orderId) {
    try {
      order = await prisma.order.findUnique({ 
        where: { id: orderId },
        include: { items: { include: { product: true } } }
      });
    } catch {}
  }

  return (
    <div className="min-h-screen bg-grey flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-dark mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your hardware materials are being prepared for dispatch.
          </p>

          {order && (
            <div className="bg-grey p-6 rounded-lg text-left mb-8">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-dark">#{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">M-Pesa Receipt:</span>
                  <span className="font-mono font-bold text-dark">{order.mpesaReceiptNumber || "Processing"}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-grey-dark mt-2">
                  <span className="font-bold text-dark">Total Amount:</span>
                  <span className="font-bold text-primary text-lg">KES {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/catalogue">
                <Package className="mr-2 h-5 w-5" /> Continue Shopping
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-5 w-5" /> Return Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}