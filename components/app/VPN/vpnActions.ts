/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/vpnActions.ts

"use server";

import {
  parseDate,
  mapCountryToServerUrl,
  getExpiryDate,
} from "@/utils/vpnUtils";

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
      throw new Error(
        `VPN server responded with ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    // console.log("VPN credentials fetched successfully:", data);

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
        paidSatoshis,
      });

      await newOrder.save();
      // console.log("Order saved successfully:", newOrder);
    }
    return data as VPNCredentials;
  } catch (error: any) {
    console.error("Error fetching VPN credentials:", error);
    throw new Error(error.message || "Internal Server Error");
  }
}
