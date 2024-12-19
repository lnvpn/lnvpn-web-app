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

export default async function ConditionsAccordion(props: IAppProps) {
  const countryNetworkData = await getCountryNetworkData(props.isoCode);

  return (
    <Accordion className="w-full lg:w-[unset]" type="single" collapsible>
      <AccordionItem className="lg:w-[500px] max-w-full" value="item-1">
        <AccordionTrigger>Available Networks</AccordionTrigger>
        <AccordionContent>
          {countryNetworkData ? (
            <ul>
              {countryNetworkData.map((network, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>{network.name}</strong>
                  </p>
                  {/* <p>
                    <strong>MCC:</strong> {network.mcc}, <strong>MNC:</strong>{" "}
                    {network.mnc}
                  </p>
                  <p>
                    <strong>Speeds:</strong> {network.speeds?.join(", ")}
                  </p> */}
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
