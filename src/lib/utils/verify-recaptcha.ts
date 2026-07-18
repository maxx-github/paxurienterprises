// src/lib/utils/verify-recaptcha.ts

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("reCAPTCHA Secret Key is missing in environment variables.");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    // Check if Google says it's successful and the score is human-like (> 0.5)
    // Note: For highly sensitive actions, you might want > 0.7
    return data.success === true && data.score > 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}