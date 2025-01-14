import { countryNameMap, regionsMap } from "@/data/countryNames";
import { premiumConfig } from "@/data/premiumConfig";
import { Country, NetworksResponse, Region } from "@/lib/types";

export function countryCodeToEmoji(countryCode: string): string {
  // Take only the part before a dash if exists (e.g. "US-HI" -> "US")
  const baseCode = countryCode.split("-")[0].toUpperCase();

  // Convert letters to regional indicator symbols (A -> 🇦)
  const offset = 127397;
  const chars = Array.from(baseCode)
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + offset))
    .join("");
  return chars;
}

export function slugify(name: string): string {
  // Convert to lowercase
  let slug = name.toLowerCase();

  // Normalize and remove diacritics (accents, umlauts, etc.)
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Replace any character that is not a letter, number, or space with a space
  slug = slug.replace(/[^a-z0-9\s]/g, "");

  // Replace one or more spaces with a single dash
  slug = slug.trim().replace(/\s+/g, "-");

  return slug;
}

export function getCountryCodeFromSlug(slug: string): string | null {
  for (const code in countryNameMap) {
    const name = countryNameMap[code];
    if (slugify(name) === slug) {
      return code;
    }
  }
  return null;
}

export function getRegionNameFromSlug(slug: string): string | null {
  const region = regionsMap.find((r) => r.slug === slug);
  return region ? region.name : null;
}

export function isCountrySlug(slug: string): boolean {
  return !!getCountryCodeFromSlug(slug);
}

export function isRegionSlug(slug: string): boolean {
  return !!getRegionNameFromSlug(slug);
}

export function buildCountriesAndRegions(
  networksData: NetworksResponse | null
): { countries: Country[]; regions: Region[] } {
  let countries: Country[] = [];
  let regions: Region[] = [];

  // 1) Build countries
  if (networksData && Array.isArray(networksData.countryNetworks)) {
    countries = networksData.countryNetworks.map((c) => {
      const code = c.name.toUpperCase(); // e.g. "US"
      const fullName = countryNameMap[code] || code; // e.g. "United States"
      const flag = countryCodeToEmoji(code); // e.g. "🇺🇸"
      const slug = slugify(fullName); // e.g. "united-states"
      return { code, name: fullName, flag, slug };
    });
    // Sort alphabetically by country name
    countries.sort((a, b) => a.name.localeCompare(b.name));
  }

  // 2) Build regions from your predefined regionsMap
  if (Array.isArray(regionsMap)) {
    regions = regionsMap.map((r) => ({
      name: r.name,
      slug: r.slug,
    }));
  }

  return { countries, regions };
}

export function getPremiumMultiplier(slug: string): number {
  // 1️⃣ Check if it's a country slug
  const countryCode = getCountryCodeFromSlug(slug);
  if (countryCode) {
    return (
      premiumConfig.multipliers[countryCode] ?? premiumConfig.defaultMultiplier
    );
  }

  // 2️⃣ Check if it's a region slug
  const regionName = getRegionNameFromSlug(slug);
  if (regionName) {
    return (
      premiumConfig.multipliers[regionName] ?? premiumConfig.defaultMultiplier
    );
  }

  // 3️⃣ Fallback to default multiplier
  return premiumConfig.defaultMultiplier;
}
