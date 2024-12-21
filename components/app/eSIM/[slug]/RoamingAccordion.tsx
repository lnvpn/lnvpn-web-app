import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getEntityData, getCountryNetworkData } from "./SIMDetailPageActions";

import { countryCodeToEmoji } from "@/utils/esimUtils";

export default async function RoamingAccordion(props: { isoCode: string }) {
  const bundleDataList = await getEntityData(props.isoCode || "");

  if (!bundleDataList || bundleDataList.length === 0) return null;

  const bundleData = bundleDataList[0];

  if (!bundleData.roamingEnabled || bundleData.roamingEnabled.length === 0)
    return null;

  const networkData = await Promise.all(
    bundleData.roamingEnabled.map(async (country) => {
      const networks = (await getCountryNetworkData(country.iso)) || [];
      return {
        countryName: country.name,
        countryIso: country.iso,
        networkData: networks,
      };
    })
  );

  return (
    <Accordion className="w-full" type="single" collapsible>
      <AccordionItem className="max-w-full" value="item-1">
        <AccordionTrigger>Included Countries & Networks</AccordionTrigger>
        <AccordionContent>
          {networkData.length > 0 ? (
            <div className="space-y-6">
              {networkData.map((item, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">
                      {countryCodeToEmoji(item.countryIso)}
                    </span>
                    {item.countryName}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-5">
                    {item.networkData.map((network, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{network.brandName}</span>
                        {network.speed?.length > 0 && (
                          <span>: {network.speed.join(" / ")}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No network data available for these countries.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
