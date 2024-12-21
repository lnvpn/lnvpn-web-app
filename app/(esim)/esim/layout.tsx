import React from "react";
import TabsWrapper from "@/components/app/eSIM/TabsWrapper";

import SearchCommand from "@/components/app/eSIM/SIMSearchComponente";
import { getNetworks } from "@/components/app/eSIM/SIMactions";
import { NetworksResponse } from "@/lib/types";
import { countryNameMap, regionsMap } from "@/data/countryNames"; // Ensure regionsMap is exported from this file
import { countryCodeToEmoji, slugify } from "@/utils/esimUtils";
import { Suspense } from "react";

interface EsimLayoutProps {
  children: React.ReactNode;
}

export default async function EsimLayout({ children }: EsimLayoutProps) {
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

  // Prepare regions data
  const allRegions = regionsMap.map((region) => ({
    name: region.name,
    slug: region.slug,
  }));

  return (
    <main className="flex flex-col justify-center items-center gap-4 px-4">
      <h1 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        LN SIM
      </h1>
      <h2 className="text-center mb-3">
        Buy eSIM plans for global connectivity using Bitcoin. Privacy-focused,
        secure, and reliable.
      </h2>
      <div className="flex justify-center items-center my-4">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchCommand
            countries={sortedCountries.map(({ code, name, flag, slug }) => ({
              code,
              name,
              flag,
              slug,
            }))}
            regions={allRegions} // Pass regions here
          />
        </Suspense>
      </div>

      {/* Tabs Navigation */}
      <TabsWrapper />

      {/* Render the selected tab content */}
      {children}
    </main>
  );
}
