// src/app/api/mpesa/route.ts
import { NextResponse } from "next/server";

/**
 * Legacy M-Pesa entrypoint. Live STK callbacks must use /api/mpesa/callback.
 * Keep this route closed so unauthenticated clients cannot probe it.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Use /api/mpesa/callback for STK callbacks." },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json({ message: "Use /api/mpesa/stkpush and /api/mpesa/callback." });
}
