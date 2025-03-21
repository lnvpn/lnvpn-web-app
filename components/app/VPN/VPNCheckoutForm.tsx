// CheckoutForm.tsx
"use client";
import React from "react";
import { Button } from "../../ui/button";
import CountrySelector from "./CountrySelector";
import DurationSelector from "./DurationSelector";
import VPNAppCollapsible from "./VPNAppCollapsible";
import KeySection from "./KeySection";
import PriceDisplay from "./PriceDisplay";
import CountryAlert from "./CountryAlert";

interface CheckoutFormProps {
  selectedDuration: number;
  setSelectedDuration: React.Dispatch<React.SetStateAction<number>>;
  selectedCountry: string | undefined;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string | undefined>>;
  keys: {
    publicKey: string;
    privateKey: string;
    presharedKey: string;
  } | null;
  regenerateKeys: () => void;
  handlePurchase: () => void;
  isAlertOpen: boolean;
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VPNCheckoutForm({
  selectedDuration,
  setSelectedDuration,
  selectedCountry,
  setSelectedCountry,
  keys,
  regenerateKeys,
  handlePurchase,
  isAlertOpen,
  setIsAlertOpen,
}: CheckoutFormProps) {
  return (
    <div className="flex w-full flex-col text-lg gap-5">
      <div className="flex w-full items-center">
        <VPNAppCollapsible />
      </div>

      <div className="flex items-center w-full gap-2 justify-between flex-nowrap">
        <CountrySelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <p className="px-3">Step 3: Select duration</p>
        <DurationSelector
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
        />
      </div>

      <div className="flex w-full items-center">
        <KeySection keys={keys} regenerateKeys={regenerateKeys} />
      </div>

      <div className="flex justify-center w-full">
        <PriceDisplay selectedDuration={selectedDuration} />
      </div>

      <div className="w-full justify-center flex p-2">
        <Button variant={"neutral"} size={"lg"} onClick={handlePurchase}>
          Buy VPN
        </Button>
      </div>

      {/* Country Alert Dialog */}
      <CountryAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
