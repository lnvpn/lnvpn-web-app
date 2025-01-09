import { countryNameMap } from "@/data/countryNames";
import { getNetworksFromAPI } from "@/utils/esim-api/Networks";
import type { MetadataRoute } from "next";

const BASE_URL = "https://lnvpn.net";
const SITEMAP_LIMIT = 50000;

export async function generateSitemaps() {
  const networksResponse = await getNetworksFromAPI();

  if (!networksResponse) {
    console.error("Failed to fetch networks for sitemap generation.");
    return [{ id: 0 }];
  }

  const totalUrls = networksResponse.countryNetworks.length;
  const totalSitemaps = Math.ceil(totalUrls / SITEMAP_LIMIT);

  return Array.from({ length: totalSitemaps }, (_, index) => ({ id: index }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const networksResponse = await getNetworksFromAPI();

  if (!networksResponse) {
    console.error("Failed to fetch networks for sitemap generation.");
    return [];
  }

  // Calculate start and end indices for pagination
  const start = id * SITEMAP_LIMIT;
  const end = start + SITEMAP_LIMIT;

  // Generate static URLs
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/esim`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/esim/regional`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/esim/global`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/phone-numbers`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/api/documentation`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Generate dynamic eSIM data plan URLs
  const dynamicUrls = networksResponse.countryNetworks
    .slice(start, end)
    .flatMap((country) => {
      const countrySlug = (
        countryNameMap[country.name] || country.name
      ).toLowerCase();

      return {
        url: `${BASE_URL}/esim/data-plans/${countrySlug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

  return [...staticUrls, ...dynamicUrls];
}
