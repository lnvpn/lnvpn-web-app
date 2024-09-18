// components/VPNCheckout.tsx
"use client";
import * as React from "react";
import { Button } from "../ui/button";
import CountrySelector from "./VPN/CountrySelector";
import DurationSelector from "./VPN/DurationSelector";
import VPNAppCollapsible from "./VPN/VPNAppCollapsible";
import KeySection from "./VPN/KeySection";
import PriceDisplay from "./VPN/PriceDisplay";
import { generateKeypair } from "@/utils/wireguard";

export default function VPNCheckout() {
  const [selectedDuration, setSelectedDuration] =
    React.useState<string>("hour");

  // Manage keys state here
  const [keys, setKeys] = React.useState<{
    publicKey: string;
    privateKey: string;
    presharedKey: string;
  } | null>(null);

  const regenerateKeys = React.useCallback(() => {
    const newKeys = generateKeypair();
    setKeys(newKeys);
  }, []);

  React.useEffect(() => {
    regenerateKeys();
  }, [regenerateKeys]);

  return (
    <div className="w-full mx-auto mt-10 max-w-screen-md px-4 md:px-20 sm:px-6 lg:px-8 bg-main text-black rounded-base shadow-light dark:shadow-dark font-bold border-2 border-border dark:border-darkBorder p-4 ">
      <div className="flex w-full flex-col text-lg gap-5">
        <div className="flex w-full items-center">
          <VPNAppCollapsible />
        </div>

        <div className="flex items-center w-full gap-2 justify-between flex-nowrap">
          <CountrySelector />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="px-3">3. Select duration</p>
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
          <Button variant={"neutral"} size={"lg"}>
            Pay with Bitcoin
          </Button>
        </div>
      </div>
    </div>
  );
}
