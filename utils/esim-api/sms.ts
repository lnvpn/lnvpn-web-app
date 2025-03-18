"use server";

export interface SendSmsResponse {
  message: string;
}

export async function sendSMS(
  iccid: string,
  message: string
): Promise<SendSmsResponse | null> {
  const rawSmsApiUrl = process.env.ESIM_SMS_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!rawSmsApiUrl || !apiKey) {
    const missingVars = [];
    if (!rawSmsApiUrl) missingVars.push("ESIM_SMS_API_URL");
    if (!apiKey) missingVars.push("ESIM_API_KEY");
    console.error(
      `Missing required environment variables for sending SMS: ${missingVars.join(
        ", "
      )}`
    );
    return null;
  }

  // Replace placeholder {iccid} with the actual iccid if present in the URL
  const smsApiUrl = rawSmsApiUrl.includes("{iccid}")
    ? rawSmsApiUrl.replace("{iccid}", iccid)
    : rawSmsApiUrl;

  try {
    const res = await fetch(smsApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },

      body: JSON.stringify({
        message,
        // from: "LNVPN" // Not implemented in the SMS API
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Failed to send SMS. Status: ${res.status}. Response: ${errorBody}`
      );
      return null;
    }

    const data: SendSmsResponse = await res.json();
    return data;
  } catch (error) {
    console.error("An error occurred while sending SMS:", error);
    return null;
  }
}
