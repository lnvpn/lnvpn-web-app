import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function DescriptionAccordion() {
  return (
    <Accordion className="w-full" type="single" collapsible>
      <AccordionItem className="max-w-full" value="item-3">
        <AccordionTrigger>Product Description</AccordionTrigger>
        <AccordionContent>
          <p className="font-semibold mb-4">
            Traveling soon? Avoid the hassle of local SIM cards and stay
            connected with ease using our eSIM solution. Enjoy seamless internet
            access without the surprise of high roaming charges or hidden fees.
            Simply ensure your smartphone supports eSIM functionality and verify
            that your chosen plan covers your destination.
          </p>
          <h3 className="text-lg font-bold mt-6 mb-2">Why Choose Our eSIM?</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>
              <strong>High-Speed Connectivity:</strong> Get access to top-tier
              networks for reliable internet.
            </li>
            <li>
              <strong>Instant Activation:</strong> Set up your eSIM immediately
              for uninterrupted access.
            </li>
            <li>
              <strong>Dual SIM Flexibility:</strong> Keep your primary SIM and
              phone number active while traveling.
            </li>
            <li>
              <strong>Hotspot Functionality:</strong> Share data effortlessly,
              even on unlimited plans.
            </li>
            <li>
              <strong>Transparent Pricing:</strong> No hidden charges or fees,
              ever.
            </li>
          </ul>
          <h3 className="text-lg font-bold mt-6 mb-2">Important Information</h3>
          <p className="mb-2">Before purchasing, confirm:</p>
          <ul className="list-circle pl-5 mb-4">
            <li>Your device is compatible with eSIM functionality.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
