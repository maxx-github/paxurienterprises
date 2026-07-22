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
    const checkoutRequestID = callback.CheckoutRequestID;

    if (!checkoutRequestID || typeof checkoutRequestID !== "string") {
      return NextResponse.json({ error: "Missing CheckoutRequestID" }, { status: 400 });
    }

    // ResultCode 0 means success
    if (ResultCode === 0) {
      const items: { Name: string; Value: unknown }[] = CallbackMetadata?.Item || [];
      const getMeta = (name: string) =>
        items.find((item) => item.Name === name)?.Value;

      const mpesaReceiptNumber = getMeta("MpesaReceiptNumber");
      const paidAmount = Number(getMeta("Amount"));

      const order = await prisma.order.findUnique({
        where: { checkoutRequestID },
      });

      if (!order) {
        console.warn(`Order not found for checkoutRequestID: ${checkoutRequestID}`);
        // Still ACK so Safaricom stops retrying
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
      }

      // Idempotency: already paid
      if (order.status === "PAID") {
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
      }

      // Verify paid amount matches order total (allow 1 KES rounding)
      if (
        !Number.isFinite(paidAmount) ||
        Math.abs(paidAmount - order.totalAmount) > 1
      ) {
        console.error(
          `Amount mismatch for order ${order.id}: paid=${paidAmount}, expected=${order.totalAmount}`
        );
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "CANCELLED",
            mpesaReceiptNumber:
              typeof mpesaReceiptNumber === "string"
                ? String(mpesaReceiptNumber)
                : undefined,
          },
        });
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          mpesaReceiptNumber:
            typeof mpesaReceiptNumber === "string" || typeof mpesaReceiptNumber === "number"
              ? String(mpesaReceiptNumber)
              : undefined,
        },
      });

      console.log(`Order ${order.id} paid successfully. Receipt: ${mpesaReceiptNumber}`);
    } else {
      // Payment failed / cancelled by user — mark order cancelled when we can match it
      if (checkoutRequestID) {
        await prisma.order.updateMany({
          where: {
            checkoutRequestID,
            status: "PENDING_PAYMENT",
          },
          data: { status: "CANCELLED" },
        });
      }
      console.log(`Payment failed. ResultCode: ${ResultCode}, Desc: ${ResultDesc}`);
    }

    // Safaricom expects a 200 OK response to acknowledge receipt
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("M-Pesa Callback Error:", error);
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}
