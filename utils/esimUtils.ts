import { countryNameMap, regionsMap } from "@/data/countryNames";

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
