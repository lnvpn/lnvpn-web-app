"use server";
// lib/getNetworks.ts
import { NetworksResponse } from "@/lib/types";

export async function getNetworks(): Promise<NetworksResponse | null> {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    console.error(
      "Missing required environment variables for fetching networks."
    );
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/networks?returnAll=true`, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Failed to fetch networks for eSim. Status: ${res.status}. Response: ${errorBody}`
      );
      return null;
    }

    const data = await res.json();
    console.log("Data fetched from API:", data);

    if (!data || !Array.isArray(data.countryNetworks)) {
      console.error(
        "Invalid data format: Response is not what we expected",
        data
      );
      return null;
    }

    return data as NetworksResponse;
  } catch (error) {
    console.error("An error occurred while fetching networks:", error);
    return null;
  }
}
