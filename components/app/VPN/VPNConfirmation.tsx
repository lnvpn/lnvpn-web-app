/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa6";
import { fetchVPNCredentials } from "./vpnActions";
import { vpnendpoints } from "@/data/vpnendpoints";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { QRCodeSVG } from "qrcode.react"; // Ensure this library is installed
import { buildConfigFile } from "@/utils/wireguard";
import { RefContext } from "@/app/context/RefProvider";

interface VPNCredentials {
  config: string;
}

interface VPNConfirmationProps {
  keys: {
    publicKey: string;
    privateKey: string;
    presharedKey: string;
  };
  selectedCountry: string | "" | undefined;
  selectedDuration: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsPaymentSuccessful: React.Dispatch<React.SetStateAction<boolean>>;
  regenerateKeys: () => void;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function VPNConfirmation({
  keys,
  selectedCountry,
  selectedDuration,
  setCurrentStep,
  setIsPaymentSuccessful,
  regenerateKeys,
  setSelectedCountry,
}: VPNConfirmationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<VPNCredentials | null>(null);
  const [config, setConfig] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [expiryDateString, setExpiryDateString] = useState<string>(""); // Added state variable
  const effectRan = useRef(false);

  const { ref } = useContext(RefContext);

  // Get country name for display and filename
  const countryName =
    vpnendpoints.find((endpoint) => endpoint.cc === selectedCountry)?.country ||
    selectedCountry;

  useEffect(() => {
    if (effectRan.current) {
      return;
    }
    effectRan.current = true;

    if (!keys || !selectedCountry) {
      setError("Missing keys or selected country.");
      setIsLoading(false);
      return;
    }

    startTransition(async () => {
      try {
        const priceDollar = selectedDuration; // Adjust pricing logic as needed

        const vpnCredentials = await fetchVPNCredentials({
          publicKey: keys.publicKey,
          presharedKey: keys.presharedKey,
          country: selectedCountry,
          duration: selectedDuration,
          priceDollar,
          refCode: ref || "",
        });

        // Calculate the expiry date based on the selected duration
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + selectedDuration);
        const timestamp = expiryDate.toLocaleString();

        // Build the config file here
        const configString = buildConfigFile(
          keys,
          vpnCredentials,
          timestamp,
          countryName || ""
        );

        // Set the expiry date string in state
        setExpiryDateString(timestamp);

        // Set the config and credentials
        setConfig(configString);
        setCredentials(vpnCredentials);
      } catch (error: any) {
        console.error("Error fetching credentials:", error);
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    });
  });

  const handleNewPurchase = () => {
    setCurrentStep(1);
    setIsPaymentSuccessful(false);
    setSelectedCountry(undefined);
    regenerateKeys();
  };

  const downloadConfigFile = () => {
    const expiryDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const shortCountryName = (countryName || "Unknown").split(" ")[0]; // Use first word of country name
    const filename = `LNVPN-${shortCountryName}-${expiryDate}.conf`;

    if (config) {
      const blob = new Blob([config], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Config is undefined");
    }
  };

  // const handleSendEmail = () => {
  //   Placeholder function for sending email
  //
  // };

  if (isLoading || isPending) {
    return (
      <div className="flex flex-col items-center text-lg gap-5">
        <p>Your VPN credentials are being added to the endpoint...</p>
        <FaSpinner className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-lg gap-5">
        <p className="text-red-500">Error: {error}</p>
        <Button
          variant="neutral"
          size="lg"
          onClick={handleNewPurchase}
          className="mt-6"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center  text-lg gap-5">
      <h2 className="text-2xl font-bold">Thank You for Your Purchase!</h2>

      <p>Your VPN is now ready. Below are your configuration details:</p>
      <div className="flex gap-2 justify-center flex-wrap w-full my-2 text-text font-base bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder p-4">
        <div className="rounded-base border-2 border-border dark:border-darkBorder px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
          <h3 className="font-bold">Selected Country</h3>
          <p>{countryName}</p>
        </div>
        <div className="rounded-base border-2 border-border dark:border-darkBorder  px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
          <h3 className="font-bold">Valid Until</h3>
          <p>{expiryDateString}</p>
        </div>

        {config && (
          <QRCodeSVG value={config} size={256} className="bg-white p-4" />
        )}
        <p>
          Scan the QR-Code via your Wireguard-App on your phone or download the
          config file and import it to your Wireguard-App.
        </p>

        <div className="flex gap-2 mt-2 flex-wrap w-full justify-center">
          <Button variant="default" size={"lg"} onClick={downloadConfigFile}>
            Download Config File
          </Button>
          {/* <Button variant="default" size={"lg"} onClick={handleSendEmail}>
            Send via Email
          </Button> */}
        </div>
      </div>

      {/* Collapsible for Configuration */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex w-full items-center justify-center gap-2">
          <div className="rounded-base w-full flex items-center justify-between space-x-4 border-2 border-border dark:border-darkBorder text-text bg-main px-4 py-2">
            <h4 className="font-bold">Show configuration details</h4>

            <CollapsibleTrigger asChild>
              <Button
                variant="noShadow"
                size="lg"
                className="bg-white text-text"
              >
                <ChevronDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {isOpen && (
          <CollapsibleContent className="flex flex-col gap-2 my-2 text-text font-base bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder p-4">
            {config && (
              <>
                <pre className="text-sm whitespace-pre-wrap">{config}</pre>
              </>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>
      <p>
        Make sure to save your config file before closing. Otherwise, it is
        lost.
      </p>

      <Button
        variant="neutral"
        size="lg"
        onClick={handleNewPurchase}
        className="mt-6"
      >
        Make Another Purchase
      </Button>
    </div>
  );
}
