// src/app/api/mpesa/stkpush/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { initiateSTKPush } from "@/lib/mpesa";
import { getSessionUser } from "@/lib/auth-guards";

/** Kenyan mobile: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX */
function normalizeKenyanPhone(phone: string): string | null {
  const digits = phone.replace(/[\s\-()]/g, "");
  if (/^0[17]\d{8}$/.test(digits)) {
    return `254${digits.slice(1)}`;
  }
  if (/^\+254[17]\d{8}$/.test(digits)) {
    return digits.slice(1);
  }
  if (/^254[17]\d{8}$/.test(digits)) {
    return digits;
  }
  return null;
}

type CartLine = { id: string; quantity: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, items } = body as {
      phoneNumber?: string;
      items?: CartLine[];
      // totalAmount from client is intentionally ignored — recalculated server-side
    };

    if (!phoneNumber || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing phone number or cart items" },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json({ error: "Too many items in cart." }, { status: 400 });
    }

    const formattedPhone = normalizeKenyanPhone(String(phoneNumber));
    if (!formattedPhone) {
      return NextResponse.json(
        { error: "Invalid M-Pesa phone number. Use format 07XXXXXXXX or 2547XXXXXXXX." },
        { status: 400 }
      );
    }

    // Validate quantities and collect product IDs
    const lineItems: { productId: string; quantity: number }[] = [];
    for (const item of items) {
      const quantity = Number(item?.quantity);
      const productId = typeof item?.id === "string" ? item.id : "";
      if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
        return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
      }
      lineItems.push({ productId, quantity });
    }

    const productIds = Array.from(new Set(lineItems.map((l) => l.productId)));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isAvailable: true },
      select: { id: true, price: true, stock: true, name: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable." },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Server-side price calculation — never trust client prices
    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const line of lineItems) {
      const product = productMap.get(line.productId)!;
      if (product.price == null || product.price <= 0) {
        return NextResponse.json(
          { error: `"${product.name}" is available on request only and cannot be paid online.` },
          { status: 400 }
        );
      }
      if (product.stock < line.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}".` },
          { status: 400 }
        );
      }
      totalAmount += product.price * line.quantity;
      orderItemsData.push({
        productId: line.productId,
        quantity: line.quantity,
        price: product.price,
      });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;
    if (totalAmount < 1) {
      return NextResponse.json({ error: "Order total is invalid." }, { status: 400 });
    }

    const sessionUser = await getSessionUser();

    const order = await prisma.order.create({
      data: {
        totalAmount,
        mpesaPhoneNumber: formattedPhone,
        status: "PENDING_PAYMENT",
        userId: sessionUser?.id ?? undefined,
        items: {
          create: orderItemsData,
        },
      },
    });

    const mpesaResponse = await initiateSTKPush(
      formattedPhone,
      totalAmount,
      `PAXURI-${order.id.slice(-6).toUpperCase()}`
    );

    if (!mpesaResponse?.CheckoutRequestID) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json(
        { error: "Failed to initiate payment. Please try again." },
        { status: 502 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { checkoutRequestID: mpesaResponse.CheckoutRequestID },
    });

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
