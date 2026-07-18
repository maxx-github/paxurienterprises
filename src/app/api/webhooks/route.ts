// src/app/api/webhooks/route.ts
import { NextResponse } from "next/server";

// Webhooks are typically POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Webhook received:", body);
    
    // TODO: Add your specific webhook processing logic here 
    // (e.g., verifying Stripe signatures, updating database, etc.)
    
    // Return 200 OK immediately so the webhook provider knows we received it
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Optional: A simple GET request to verify the route is active
export async function GET() {
  return NextResponse.json({ message: "Webhook route is active" });
}