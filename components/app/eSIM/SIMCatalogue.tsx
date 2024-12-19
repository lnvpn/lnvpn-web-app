import { getNetworks } from "./SIMactions";
import { NetworksResponse } from "@/lib/types";
import { countryNameMap } from "@/data/countryNames";
import { countryCodeToEmoji, slugify } from "@/utils/esimUtils";
import SearchCommand from "./SIMSearchComponente";
import LocalEsimsTab from "./SIMLocalEsimtab";
import React, { Suspense } from "react";

const topSellers = [
  "US",
  "DE",
  "GB",
  "FR",
  "CA",
  "AU",
  "JP",
  "IT",
  "ES",
  "CN",
  "BR",
  "IN",
  "ZA",
  "MX",
  "RU",
  "KR",
  "AE",
  "CH",
  "SE",
  "NL",
];

export default async function LocalPage() {
  const networksData: NetworksResponse | null = await getNetworks();

  if (
    !networksData ||
    !Array.isArray(networksData.countryNetworks) ||
    networksData.countryNetworks.length === 0
  ) {
    return (
      <main className="p-4">
        <h1 className="text-3xl font-bold mb-6">eSIM Networks</h1>
        <div>No networks available or an error occurred.</div>
      </main>
    );
  }

  // Prepare country data: full name & flag
  const allCountries = networksData.countryNetworks.map((c) => {
    const code = c.name.toUpperCase();
    const fullName = countryNameMap[code] || code;
    const flag = countryCodeToEmoji(code);
    const slug = slugify(fullName);
    return { code, name: fullName, flag, slug, networks: c.networks };
  });

  // Sort all countries alphabetically by name
  const sortedCountries = [...allCountries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Filter top sellers
  const topSellerCountries = topSellers
    .map((code) => sortedCountries.find((c) => c.code === code))
    .filter(Boolean) as typeof sortedCountries;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex justify-center items-center my-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchCommand
            countries={sortedCountries.map(({ code, name, flag, slug }) => ({
              code,
              name,
              flag,
              slug,
            }))}
          />
        </Suspense>
      </div>
      <LocalEsimsTab
        topSellerCountries={topSellerCountries}
        allCountries={sortedCountries}
      />
    </div>
  );
}
