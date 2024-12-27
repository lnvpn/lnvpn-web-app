"use server";

import {
  isCountrySlug,
  isRegionSlug,
  getRegionNameFromSlug,
} from "@/utils/esimUtils";
import { getCountryCodeFromSlug } from "@/utils/esimUtils";

interface CatalogueResponse {
  bundles: RawBundle[];
  pageCount: number;
  rows: number;
  pageSize: number;
}

interface RawCountry {
  name: string;
  region: string;
  iso: string;
}

interface RawBundle {
  name: string;
  description: string;
  groups: string[];
  countries: RawCountry[];
  dataAmount: number;
  duration: number;
  speed: string[];
  autostart: boolean;
  unlimited: boolean;
  roamingEnabled: RawCountry[];
  price: number;
  imageUrl?: string;
}

export interface ProcessedBundle {
  name: string;
  speed: string[];
  description: string;
  dataInGB: number;
  durationInDays: number;
  countryName: string;
  price: number;
  roamingEnabled: RawCountry[];
  unlimited: boolean;
}

export async function getEntityData(
  slug: string
): Promise<ProcessedBundle[] | null> {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;
  const apiCountryParam = process.env.ESIM_API_COUNTRY_PARAM || "country=";
  const apiBundleParam = process.env.ESIM_API_BUNDLE_PARAM || "&bundles=true";
  const priceAdjustment: number = Number(
    process.env.ESIM_PRICE_ADJUSTMENT || 2
  );

  if (!baseUrl || !apiKey) {
    console.error("Missing required environment variables for fetching data.");
    return null;
  }

  let url: string;
  if (isCountrySlug(slug)) {
    const isoCode = getCountryCodeFromSlug(slug)!;
    url = `${baseUrl}/${apiCountryParam}${isoCode}${apiBundleParam}`;
  } else if (isRegionSlug(slug)) {
    const regionName = getRegionNameFromSlug(slug)!;
    // Replace spaces with '+' to mimic URL encoding for query params
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
      next: { revalidate: 360000 },
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

    const processedBundles = data.bundles.map((bundle) => {
      const dataInGB = bundle.dataAmount / 1000;
      const countryName =
        bundle.countries && bundle.countries.length > 0
          ? bundle.countries[0].name
          : "Unknown Country";
      const adjustedPrice = Math.floor(bundle.price + priceAdjustment);

      return {
        name: bundle.name,
        speed: bundle.speed,
        description: bundle.description,
        dataInGB,
        durationInDays: bundle.duration,
        countryName,
        price: adjustedPrice,
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

export interface Network {
  brandName: string;
  name: string;
  mcc: string;
  mnc: string;
  tagid: string;
  speed: string[];
}

interface CountryNetwork {
  name: string;
  networks: Network[];
}

interface NetworksResponse {
  countryNetworks: CountryNetwork[];
}

export async function getCountryNetworkData(
  isoCode: string | null
): Promise<Network[] | null> {
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
      next: { revalidate: 360000 },
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
