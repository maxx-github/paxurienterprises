// src/app/api/mpesa/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Safaricom sends the data inside a 'Body' -> 'stkCallback' object
    const callback = body.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ error: "Invalid callback payload" }, { status: 400 });
    }

    const { ResultCode, ResultDesc, CallbackMetadata } = callback;
    const merchantRequestID = callback.MerchantRequestID;
    const checkoutRequestID = callback.CheckoutRequestID;

    // ResultCode 0 means success
    if (ResultCode === 0) {
      // Extract M-Pesa Receipt Number from CallbackMetadata
      const receiptItem = CallbackMetadata?.Item?.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      );
      const mpesaReceiptNumber = receiptItem?.Value;

      // Find the order by CheckoutRequestID (You might need to add CheckoutRequestID to your Order model in Prisma for exact matching, 
      // but for now, we'll update the latest pending order for that phone number, or you can store the checkoutRequestID in the DB).
      // *Best Practice: Add `checkoutRequestID String?` to the Order model in Prisma.*
      
      // For this implementation, we will update the most recent PENDING_PAYMENT order.
      const order = await prisma.order.findFirst({
        where: { status: "PENDING_PAYMENT" },
        orderBy: { createdAt: "desc" },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            mpesaReceiptNumber: mpesaReceiptNumber,
          },
        });
        
        // TODO: Trigger email/SMS notification to admin and user here
        console.log(`Order ${order.id} paid successfully. Receipt: ${mpesaReceiptNumber}`);
      }
    } else {
      console.log(`Payment failed. ResultCode: ${ResultCode}, Desc: ${ResultDesc}`);
      // Optionally update order status to CANCELLED
    }

    // Safaricom expects a 200 OK response to acknowledge receipt
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (error) {
    console.error("M-Pesa Callback Error:", error);
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}