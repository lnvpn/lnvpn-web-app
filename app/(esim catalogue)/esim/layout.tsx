import React from "react";
import TabsWrapper from "@/components/app/eSIM/TabsWrapper";

import SearchCommand from "@/components/app/eSIM/SIMSearchComponente";
import { getNetworks } from "@/components/app/eSIM/SIMactions";
import { NetworksResponse } from "@/lib/types";
import { buildCountriesAndRegions } from "@/utils/esimUtils";
import { Suspense } from "react";
import SIMProfilButton from "@/components/app/eSIM/SIMProfileButton";

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
      <main className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">eSIM Networks</h1>
        <div>No networks available or an error occurred.</div>
      </main>
    );
  }

  const { countries, regions } = buildCountriesAndRegions(networksData);

  return (
    <main className="flex flex-col justify-center items-center gap-4 px-4">
      {/* <div className="flex justify-end  w-full items-center mt-4">
        <SIMProfilButton />
      </div> */}
      <h1 className="mt-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        LN SIM
      </h1>
      <SIMProfilButton />
      <h2 className="text-center mt-6">
        Buy eSIM plans for global connectivity using Bitcoin. Privacy-focused,
        secure, and reliable.
      </h2>
      <div className="flex justify-center items-center my-4">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchCommand
            countries={countries.map(({ code, name, flag, slug }) => ({
              code,
              name,
              flag,
              slug,
            }))}
            regions={regions} // Pass regions here
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
