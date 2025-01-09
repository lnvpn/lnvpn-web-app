import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NetworkInfo } from "@/lib/types";

export interface NetworkAccordionProps {
  networks: NetworkInfo[];
}

export default async function NetworksAccordion(props: NetworkAccordionProps) {
  if (!props.networks) return null;

  return (
    <Accordion className="w-full " type="single" collapsible>
      <AccordionItem className=" max-w-full" value="item-1">
        <AccordionTrigger>Included Networks</AccordionTrigger>
        <AccordionContent>
          {props.networks ? (
            <ul>
              {props.networks.map((network, index) => (
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
