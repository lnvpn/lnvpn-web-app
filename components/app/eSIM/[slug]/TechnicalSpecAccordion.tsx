import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function TechnicalSpecsAccordion() {
  return (
    <Accordion className="w-full" type="single" collapsible>
      <AccordionItem className="max-w-full" value="item-4">
        <AccordionTrigger>Technical Specs</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-5 mb-4">
            <li>
              <strong>Coverage:</strong> Available only in the selected
              countries or regions associated with your plan.
            </li>
            <li>
              <strong>Plan Type:</strong> Data-only service.
            </li>
            <li>
              <strong>Validity Period:</strong> The eSIM can be activated ahead
              of travel, but it only starts its validity period when used in a
              supported location.
            </li>
            <li>
              <strong>WiFi Hotspot:</strong> Compatible with hotspot
              functionality.
            </li>
            <li>
              <strong>Top-up Option:</strong> Currently unavailable.
            </li>
            <li>
              <strong>Phone Number:</strong> Not included in the package.
            </li>
            <li>
              <strong>SMS:</strong> Sending and receiving text messages is not
              supported.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
