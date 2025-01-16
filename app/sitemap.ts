import type { MetadataRoute } from "next";
import { countryNameMap, regionsMap } from "@/data/countryNames";
import { getNetworksFromAPI } from "@/utils/esim-api/Networks";
import { slugify } from "@/utils/esimUtils";

const BASE_URL = "https://lnvpn.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const networksResponse = await getNetworksFromAPI();

  // If there's an error or no data, return an empty list
  if (!networksResponse) {
    console.error("Failed to fetch networks for sitemap generation.");
    return [];
  }

  // Define your static routes
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/esim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/esim/regional`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/esim/global`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/phone-numbers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/api/documentation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Build region-based routes
  const regionUrls = regionsMap.map((region) => {
    return {
      url: `${BASE_URL}/esim/data-plans/${region.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  // Build country-based eSIM routes using fetched data
  const countryUrls = networksResponse.countryNetworks.map((country) => {
    const countrySlug = slugify(countryNameMap[country.name] || country.name);
    return {
      url: `${BASE_URL}/esim/data-plans/${countrySlug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  // Return a single array of all sitemap URLs
  return [...staticUrls, ...regionUrls, ...countryUrls];
}
