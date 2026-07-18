// src/lib/mpesa/index.ts
import axios from "axios";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
// Use sandbox for testing, production for live
const BASE_URL = "https://sandbox.safaricom.co.ke"; 

// 1. Generate Access Token
export async function generateMpesaToken(): Promise<string> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  
  const response = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
}

// 2. Initiate STK Push (Lipa Na M-Pesa Online)
export async function initiateSTKPush(phoneNumber: string, amount: number, accountReference: string) {
  const token = await generateMpesaToken();
  
  // Format timestamp: YYYYMMDDHHMMSS
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  // Generate Password: Base64(Shortcode + Passkey + Timestamp)
  const password = Buffer.from(
    `${SHORTCODE}${PASSKEY}${timestamp}`
  ).toString("base64");

  // Ensure phone number is in 2547XXXXXXXX format
  const formattedPhone = phoneNumber.startsWith("0") 
    ? `254${phoneNumber.slice(1)}` 
    : phoneNumber.startsWith("+") 
    ? phoneNumber.slice(1) 
    : phoneNumber;

  const callbackUrl = process.env.MPESA_CALLBACK_URL!;

  const response = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount), // M-Pesa doesn't accept decimals
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: "Paxuri Hardware Purchase",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}