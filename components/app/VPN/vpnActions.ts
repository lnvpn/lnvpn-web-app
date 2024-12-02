/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/vpnActions.ts

"use server";

import {
  parseDate,
  mapCountryToServerUrl,
  getExpiryDate,
} from "@/utils/vpnUtils";
import sgMail from "@sendgrid/mail";
import { getPrice } from "@/utils/lightning";
import Order from "@/models/order";
import { connectToDatabase } from "@/utils/mongodb";

interface VPNCredentials {
  config: string;
  // Include other fields as needed
}

interface VPNCredentialsRequest {
  publicKey: string;
  presharedKey: string;
  country: string; // This is the country code, e.g., "13"
  duration: number;
  priceDollar: number;
  refCode?: string | null;
}

export async function fetchVPNCredentials(
  request: VPNCredentialsRequest
): Promise<VPNCredentials> {
  const { publicKey, presharedKey, country, duration, priceDollar, refCode } =
    request;

  const authToken = process.env.VPN_API_AUTH;
  if (!authToken) {
    console.error("Authorization token is missing in environment variables.");
    throw new Error("Server configuration error.");
  }

  // Validate required fields
  if (!publicKey || !presharedKey || !country || !duration) {
    throw new Error("Missing required fields in request.");
  }

  // Map country code to server URL
  const serverUrl = mapCountryToServerUrl(country);
  if (!serverUrl) {
    console.error(`Invalid country selected: ${country}`);
    throw new Error("Invalid country selected.");
  }

  // Calculate expiry date
  const expiryDateObj = getExpiryDate(duration);
  const expiryDate = parseDate(expiryDateObj);

  const requestBody = {
    publicKey,
    presharedKey,
    bwLimit: 50000 * priceDollar, // Adjust the calculation as needed
    subExpiry: expiryDate,
    ipIndex: 0,
  };

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
      // Log error details, including server URL and country code
      console.error(
        `VPN server at ${serverUrl} responded with status ${response.status} for country ${country}: ${errorText}`
      );
      throw new Error(
        `VPN server at ${serverUrl} responded with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    // If refCode exists, calculate `paidSatoshis` and save to database
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

    return data as VPNCredentials;
  } catch (error: any) {
    // Log error details, including server URL and country code
    console.error(
      `Error fetching VPN credentials from ${serverUrl} for country ${country}: ${error.message}`
    );

    // Optionally, log the error code or other relevant error properties
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }

    throw new Error(error.message || "Internal Server Error");
  }
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
