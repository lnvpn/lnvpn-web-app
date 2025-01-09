"use server";

import {
  CatalogueResponse,
  NetworkInfo,
  NetworksResponse,
  ProcessedBundle,
} from "@/lib/types";

export async function getNetworksFromAPI(): Promise<NetworksResponse | null> {
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
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Failed to fetch networks for eSim. Status: ${res.status}. Response: ${errorBody}`
      );
      return null;
    }

    const data = await res.json();

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

import {
  isCountrySlug,
  isRegionSlug,
  getRegionNameFromSlug,
  getPremiumMultiplier,
} from "@/utils/esimUtils";
import { getCountryCodeFromSlug } from "@/utils/esimUtils";

export async function getEntityDataFromAPI(
  slug: string
): Promise<ProcessedBundle[] | null> {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;
  const apiCountryParam = process.env.ESIM_API_COUNTRY_PARAM || "country=";
  const apiBundleParam = process.env.ESIM_API_BUNDLE_PARAM || "&bundles=true";
  let priceAdjustment: number = 1.1;

  if (!baseUrl || !apiKey) {
    console.error("Missing required environment variables for fetching data.");
    return null;
  }

  // Decide the final API URL
  let url: string;
  if (isCountrySlug(slug)) {
    const isoCode = getCountryCodeFromSlug(slug)!;
    url = `${baseUrl}/${apiCountryParam}${isoCode}${apiBundleParam}`;
  } else if (isRegionSlug(slug)) {
    const regionName = getRegionNameFromSlug(slug)!;
    const encodedRegionName = regionName.replace(/\s+/g, "+");
    url = `${baseUrl}/${apiCountryParam}${encodedRegionName}${apiBundleParam}`;
  } else {
    console.error(`Invalid slug: ${slug} is neither a country nor a region.`);
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Failed to fetch data for slug: ${slug}. Status: ${res.status}. Response: ${errorBody}`
      );
      return null;
    }

    const data: CatalogueResponse = await res.json();
    if (!data || !Array.isArray(data.bundles)) {
      console.error("Invalid data format for slug:", slug, data);
      return null;
    }

    // Determine the multiplier for this slug
    priceAdjustment = getPremiumMultiplier(slug);

    // Process and adjust the price
    const processedBundles: ProcessedBundle[] = data.bundles.map((bundle) => {
      const dataInGB = bundle.dataAmount / 1000;
      const countryName =
        bundle.countries && bundle.countries.length > 0
          ? bundle.countries[0].name
          : "Unknown Country";

      // Apply the multiplier
      // Apply the multiplier, round up to the nearest dollar, and subtract 1 cent
      const adjustedPrice = bundle.price * priceAdjustment;
      const finalPrice = Math.ceil(adjustedPrice) - 0.01;

      return {
        name: bundle.name,
        speed: bundle.speed,
        description: bundle.description,
        dataInGB,
        durationInDays: bundle.duration,
        countryName,
        price: finalPrice,
        roamingEnabled: bundle.roamingEnabled,
        unlimited: bundle.unlimited,
      };
    });

    return processedBundles;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return null;
  }
}

export async function getCountryNetworkDataFromAPI(
  isoCode: string | null
): Promise<NetworkInfo[] | null> {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!isoCode) {
    console.error("Missing required ISO code for fetching network data.");
    return null;
  }

  if (!baseUrl || !apiKey) {
    console.error(
      "Missing required environment variables for fetching network data."
    );
    return null;
  }

  try {
    const url = `${baseUrl}/networks?isos=${isoCode}`;
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": apiKey,
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Failed to fetch network data for ISO code: ${isoCode}. Status: ${res.status}. Response: ${errorBody}`
      );
      return null;
    }

    const data: NetworksResponse = await res.json();

    if (!data || !Array.isArray(data.countryNetworks)) {
      console.error(
        "Invalid data format: Response is not what we expected",
        data
      );
      return null;
    }

    const networks = data.countryNetworks.flatMap(
      (country) => country.networks
    );
    return networks;
  } catch (error) {
    console.error("An error occurred while fetching network data:", error);
    return null;
  }
}
