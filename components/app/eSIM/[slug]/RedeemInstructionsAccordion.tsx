import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function RedeemInstructionsAccordion() {
  return (
    <Accordion className="w-full" type="single" collapsible>
      <AccordionItem className="max-w-full" value="item-1">
        <AccordionTrigger>Redeem Instructions</AccordionTrigger>
        <AccordionContent>
          <ol className="list-decimal pl-5 mb-4">
            <li>
              After completing your payment, you will be redirected to a setup
              page with detailed installation instructions.
            </li>
            <li>
              Use your device to scan the provided QR code or manually enter the
              activation code.
            </li>
            <li>
              Enable data roaming in your device settings to begin using the
              eSIM.
            </li>
          </ol>
          <p className="mt-4">
            <strong>Important Reminder:</strong> Ensure you have a stable
            internet connection during the eSIM installation process. It is
            recommended to set up the eSIM before your trip so you can connect
            instantly upon arrival. Keep in mind that the eSIM can only be
            installed once, and its validity period begins when it connects to a
            supported network.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
