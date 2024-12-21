import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCountryNetworkData } from "./SIMDetailPageActions";

export interface IAppProps {
  isoCode: string;
}

export default async function NetworksAccordion(props: IAppProps) {
  const countryNetworkData = await getCountryNetworkData(props.isoCode);

  return (
    <Accordion className="w-full " type="single" collapsible>
      <AccordionItem className=" max-w-full" value="item-1">
        <AccordionTrigger>Included Networks</AccordionTrigger>
        <AccordionContent>
          {countryNetworkData ? (
            <ul>
              {countryNetworkData.map((network, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>{network.brandName}</strong>
                  </p>

                  {network.speed?.length > 0 && (
                    <p>Speed: {network.speed.join(" / ")}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No network data available for this country.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
