import { sendSMS } from "@/utils/esim-api/sms";
import { isError } from "@/utils/isError";
import crypto from "crypto";

export async function POST(request: Request): Promise<Response> {
  // Read the raw body once
  const rawBody = await request.text();

  try {
    // Retrieve the signature header (using the provider's header name)
    const signatureHeader = request.headers.get("x-signature-sha256");
    if (!signatureHeader) {
      return new Response(
        JSON.stringify({ error: "Missing signature header" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ensure we have an API key to use as the HMAC key
    const apiKey = process.env.ESIM_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API key configuration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compute the HMAC signature using the raw body
    const computedSignature = crypto
      .createHmac("sha256", apiKey)
      .update(rawBody)
      .digest("base64");

    // Validate the computed signature against the signature header
    if (computedSignature !== signatureHeader) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Now parse the JSON payload using the stored rawBody
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { alertType, iccid } = body;
    if (!iccid || !alertType) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Case 1: Handle FirstAttachment (welcome SMS)
    if (alertType === "FirstAttachment") {
      const smsMessage = `Welcome to LNVPN. Your eSIM is installed and ready, please enable roaming. Your eSIM profile page: https://lnvpn.net/user/${iccid}`;
      console.log(`Sending welcome SMS to ${iccid}`);
      const smsResult = await sendSMS(iccid, smsMessage);

      if (!smsResult) {
        return new Response(
          JSON.stringify({ error: "Failed to send welcome SMS" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Welcome SMS sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Case 2: Handle Utilisation (usage notification)
    if (alertType === "Utilisation") {
      const { bundle } = body;
      if (
        !bundle ||
        bundle.initialQuantity === undefined ||
        bundle.remainingQuantity === undefined
      ) {
        return new Response(
          JSON.stringify({ message: "Invalid bundle data" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const { initialQuantity, remainingQuantity } = bundle;
      // Calculate usage percentage
      const usagePercent =
        ((initialQuantity - remainingQuantity) / initialQuantity) * 100;

      // Proceed only if usage is 80% or higher
      if (usagePercent < 80) {
        return new Response(
          JSON.stringify({ message: "Usage below threshold" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      // Determine whether the usage is 80% or 100% (or more)
      const usageMessage = usagePercent >= 100 ? "100%" : "80%";
      const smsMessage = `Hey, you have used ${usageMessage} of your data. You can top up your esim at https://lnvpn.net/user/${iccid}`;
      console.log(smsMessage);
      const smsResult = await sendSMS(iccid, smsMessage);

      if (!smsResult) {
        return new Response(
          JSON.stringify({ error: "Failed to send usage SMS" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Usage SMS sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // If the alertType is not handled, return a default response
    return new Response(JSON.stringify({ message: "Alert type not handled" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    if (isError(error)) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
