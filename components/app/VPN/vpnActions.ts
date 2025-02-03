/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/vpnActions.ts
"use server";

import {
  parseDate,
  mapCountryToServerUrl,
  getExpiryDate,
} from "@/utils/vpnUtils";
import { getPrice } from "@/utils/lightning";
import { connectToDatabase } from "@/utils/mongodb";
import sgMail from "@sendgrid/mail";
import Order from "@/models/order";

/**
 * Ephemeral, in-memory store so we can return the same VPN server response
 * if the user (or React) calls this function more than once for the same key/country.
 * Key = `${publicKey}-${country}`
 */
const ephemeralStore = new Map<string, any>();

interface VPNCredentials {
  config: string;
}

interface VPNCredentialsRequest {
  publicKey: string;
  presharedKey: string;
  country: string; // e.g. "13" or "4" etc.
  duration: number;
  priceDollar: number;
  refCode?: string | null;
}

/**
 * Idempotent function that returns the VPN server's credentials for a given publicKey/country.
 * If the same publicKey/country is requested again, returns the SAME data from ephemeral RAM.
 */
export async function fetchVPNCredentials(
  request: VPNCredentialsRequest
): Promise<VPNCredentials> {
  const { publicKey, presharedKey, country, duration, priceDollar, refCode } =
    request;

  // 1. Check if we already have data in ephemeralStore for (publicKey+country).
  const cacheKey = `${publicKey}-${country}`;
  if (ephemeralStore.has(cacheKey)) {
    // Return the same data we stored last time (idempotent).
    return ephemeralStore.get(cacheKey);
  }

  // 2. Basic validations
  if (!publicKey || !presharedKey || !country || !duration) {
    throw new Error("Missing required fields in request.");
  }
  const serverUrl = mapCountryToServerUrl(country);
  if (!serverUrl) {
    console.error(`Invalid country code: ${country}`);
    throw new Error("Invalid country code.");
  }
  const authToken = process.env.VPN_API_AUTH;
  if (!authToken) {
    throw new Error("Server configuration error: missing VPN_API_AUTH");
  }

  // 3. Calculate expiry date
  const expiryDateObj = getExpiryDate(duration);
  const expiryDate = parseDate(expiryDateObj); // returns a string for the date

  // 4. Prepare the POST request body for the VPN server

  const requestBody = {
    publicKey,
    presharedKey,
    subExpiry: expiryDate,
    bwLimit: 100000 * priceDollar, // 100GB per dollar
    ipIndex: 0,
  };

  // 5. Send a POST to the VPN server to add the key
  let data: VPNCredentials;
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `VPN server at ${serverUrl} responded with status ${response.status}: ${errorText}`
      );
      throw new Error(`VPN server error: ${errorText}`);
    }

    data = await response.json();
  } catch (error: any) {
    console.error(
      `Error adding key to VPN server at ${serverUrl}: ${error.message}`
    );
    throw new Error(error.message || "Failed to add key to VPN server");
  }

  // 6. If we have a referral code, store the referral payment logic in DB (optional).
  if (refCode) {
    await connectToDatabase();

    const satsPerDollar = await getPrice();
    if (satsPerDollar === null) {
      throw new Error("Failed to fetch the Bitcoin price.");
    }
    const paidSatoshis = Math.round(priceDollar * satsPerDollar);

    const newOrder = new Order({
      partnerCode: refCode,
      amount: paidSatoshis,
    });
    await newOrder.save();
  }

  // 7. Store the *non-sensitive* server response in ephemeral memory
  ephemeralStore.set(cacheKey, data);

  // 8. Return the server's response
  return data;
}

interface SendEmailRequest {
  emailAddress: string;
  configData: string;
  expiryDate: string;
}

export async function sendEmail(request: SendEmailRequest): Promise<void> {
  if (!process.env.EMAIL_TOKEN) {
    console.error("SendGrid API key is missing in environment variables.");
    throw new Error("Server configuration error.");
  }

  try {
    sgMail.setApiKey(process.env.EMAIL_TOKEN);

    const { emailAddress, configData, expiryDate } = request;

    const msg = {
      to: emailAddress,
      from: "thanks@lnvpn.net",
      subject: `Your LNVPN config file for Wireguard. Valid until: ${expiryDate}`,
      text: `Thank you for using lnvpn.net. Find your personal config file attached. Don't lose it.\nYour subscription is valid until: ${expiryDate}`,
      attachments: [
        {
          content: Buffer.from(configData).toString("base64"),
          filename: `LNVPN.conf`,
          type: "text/plain",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(error.message || "Failed to send email");
  }
}
