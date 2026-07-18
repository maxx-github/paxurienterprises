// src/lib/sms/index.ts
import axios from 'axios';

const AFRICASTALKING_API_KEY = process.env.AFRICASTALKING_API_KEY!;
const AFRICASTALKING_USERNAME = process.env.AFRICASTALKING_USERNAME!; // Use "sandbox" for testing

export async function sendSMS(to: string, message: string) {
  try {
    // Ensure phone number is in +254 format
    const formattedTo = to.startsWith('0') ? `+254${to.slice(1)}` : to.startsWith('+') ? to : `+${to}`;

    const response = await axios.post(
      'https://api.africastalking.com/version1/messaging',
      {
        username: AFRICASTALKING_USERNAME,
        to: formattedTo,
        message: message,
      },
      {
        headers: {
          apiKey: AFRICASTALKING_API_KEY,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error };
  }
}

// Example Template for Job Match Notification
export async function notifyFundiOfJob(fundiPhone: string, jobTitle: string, deadline: string) {
  const message = `You have been shortlisted for a ${jobTitle} position at Paxuri Enterprises. Visit the website to apply before ${deadline}.`;
  return sendSMS(fundiPhone, message);
}