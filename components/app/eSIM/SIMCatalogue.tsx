import { getNetworks } from "./SIMactions";
import { NetworksResponse } from "@/lib/types";
import { countryNameMap } from "@/data/countryNames";
import { countryCodeToEmoji, slugify } from "@/utils/esimUtils";
import SearchCommand from "./SIMSearchComponente";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import LocalEsimsTab from "./SIMLocalEsimtab";
import RegionsTab from "./SIMRegionalEsimtab";

// Manually specify top sellers (ISO codes)
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

export default async function SIMCatalogue() {
  const networksData: NetworksResponse | null = await getNetworks();

  if (
    !networksData ||
    !Array.isArray(networksData.countryNetworks) ||
    networksData.countryNetworks.length === 0
  ) {
    return (
      <main className="p-4">
        <h1 className="text-3xl font-bold mb-6">eSIM Networks</h1>
        <div>
          No networks available or an error occurred while fetching data.
        </div>
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
    .filter(Boolean) as typeof sortedCountries; // some top sellers might not exist in data

  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
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
      <div className="flex flex-col justify-center  items-center ">
        <Tabs defaultValue="local" className="text-center">
          <TabsList className="my-4 ">
            <TabsTrigger value="local">Local eSIMs</TabsTrigger>
            <TabsTrigger value="regional">Regional eSIMs</TabsTrigger>
            <TabsTrigger value="global">Global eSIMs</TabsTrigger>
          </TabsList>

          <TabsContent value="local">
            <LocalEsimsTab
              topSellerCountries={topSellerCountries}
              allCountries={sortedCountries}
            />
          </TabsContent>

          <TabsContent value="regional">
            <RegionsTab />
          </TabsContent>

          <TabsContent value="global">
            {/* Implement later */}
            <div>Global eSIMs (To be implemented)</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
