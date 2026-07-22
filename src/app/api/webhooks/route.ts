// src/app/api/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Generic webhook receiver. Requires WEBHOOK_SECRET via
 * Authorization: Bearer <secret> or x-webhook-secret header.
 * Without WEBHOOK_SECRET configured, the endpoint rejects all requests.
 */
export async function POST(request: NextRequest) {
  try {
    const expected = process.env.WEBHOOK_SECRET;
    if (!expected) {
      return NextResponse.json({ error: "Webhook endpoint not configured" }, { status: 503 });
    }

    const authHeader = request.headers.get("authorization");
    const bearer =
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const headerSecret = request.headers.get("x-webhook-secret");
    const provided = bearer || headerSecret;

    if (!provided || provided !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    // Do not log full payloads (may contain PII / payment data)
    console.log("Webhook received:", {
      type: body?.type ?? body?.event ?? "unknown",
      id: body?.id ?? null,
      at: new Date().toISOString(),
    });

    // TODO: Add your specific webhook processing logic here
    // (e.g., verifying Stripe signatures, updating database, etc.)

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Webhook route is active" });
}
