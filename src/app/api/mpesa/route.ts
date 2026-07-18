// src/app/api/mpesa/route.ts
import { NextResponse } from "next/server";

// M-Pesa callbacks are typically POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("M-Pesa Callback Received:", body);
    
    // TODO: Add your M-Pesa callback validation and database update logic here
    // For now, we just return a 200 OK so Safaricom knows we received it.
    
    return NextResponse.json({ message: "Callback received successfully" }, { status: 200 });
  } catch (error) {
    console.error("M-Pesa Callback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// A simple GET request to verify the route is active
export async function GET() {
  return NextResponse.json({ message: "M-Pesa API route is active" });
}