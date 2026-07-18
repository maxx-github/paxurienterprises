// src/app/api/mpesa/stkpush/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { initiateSTKPush } from "@/lib/mpesa";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, items, totalAmount } = body;

    if (!phoneNumber || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing phone number or cart items" }, { status: 400 });
    }

    // 1. Create the Order in the Database
    const order = await prisma.order.create({
      data: {
        totalAmount: totalAmount,
        mpesaPhoneNumber: phoneNumber,
        status: "PENDING_PAYMENT",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 2. Initiate M-Pesa STK Push
    const mpesaResponse = await initiateSTKPush(
      phoneNumber, 
      totalAmount, 
      `PAXURI-${order.id.slice(-6).toUpperCase()}`
    );

    // 3. Return success response to frontend
    return NextResponse.json({
      success: true,
      message: "STK Push sent successfully. Please check your phone.",
      orderId: order.id,
      merchantRequestID: mpesaResponse.MerchantRequestID,
      checkoutRequestID: mpesaResponse.CheckoutRequestID,
    });

  } catch (error: any) {
    console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to initiate payment. Please try again." }, 
      { status: 500 }
    );
  }
}