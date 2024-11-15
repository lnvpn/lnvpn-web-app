/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa6";
import { fetchVPNCredentials, sendEmail } from "./vpnActions";
import { getExpiryDate } from "@/utils/vpnUtils";
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
import Modal from "@/components/react/components/Modal";
import { Input } from "@/components/ui/input";

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
  const [expiryDateString, setExpiryDateString] = useState<string>("");
  const effectRan = useRef(false);
  const { ref } = useContext(RefContext);

  // Email Modal state
  const [isModalActive, setIsModalActive] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPendingEmail, startEmailTransition] = useTransition();

  // Get country name and ISO code for display and filename
  const selectedEndpoint = vpnendpoints.find(
    (endpoint) => endpoint.cc === selectedCountry
  );
  const countryName = selectedEndpoint?.country || selectedCountry;
  const isoCode = selectedEndpoint?.isoCode || "XX";

  function formatExpiryDateForDisplay(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  }

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

        const expiryDateObj = getExpiryDate(selectedDuration);
        const formattedExpiryDate = formatExpiryDateForDisplay(expiryDateObj);

        setExpiryDateString(formattedExpiryDate);

        const vpnCredentials = await fetchVPNCredentials({
          publicKey: keys.publicKey,
          presharedKey: keys.presharedKey,
          country: selectedCountry,
          duration: selectedDuration,
          priceDollar,
          refCode: ref || "",
        });

        // Calculate the expiry date based on the selected duration

        // Build the config file here
        const configString = buildConfigFile(
          keys,
          vpnCredentials,
          formattedExpiryDate,
          countryName || ""
        );

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
    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // months are zero-based
    const day = String(now.getUTCDate()).padStart(2, "0");
    const dateStr = `${month}${day}`; // e.g., '1016' for October 16
    const nonce = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2 chars

    // Construct base filename
    let filenameBase = `LNVPN${isoCode}${dateStr}${nonce}`; // e.g., 'LNVPNUS1016A1'

    // Ensure filename (excluding '.conf') doesn't exceed 15 characters
    filenameBase = filenameBase.slice(0, 15 - ".conf".length);

    const filename = `${filenameBase}.conf`;

    if (config) {
      const blob = new Blob([config], {
        type: "application/octet-stream",
        endings: "native",
      });
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

  const handleSendEmail = () => {
    setIsModalActive(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailStatus("loading");
    setEmailError(null);

    startEmailTransition(async () => {
      try {
        await sendEmail({
          emailAddress,
          configData: config || "",
          expiryDate: expiryDateString,
        });
        setEmailStatus("success");
      } catch (error: any) {
        console.error("Error sending email:", error);
        setEmailError(error.message || "Failed to send email");
        setEmailStatus("error");
      }
    });
  };

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
          <Button variant="default" size={"lg"} onClick={handleSendEmail}>
            Send via Email
          </Button>
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
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {config}
                </pre>
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
      {/* Email modal--------------------------- */}
      <Modal active={isModalActive} setActive={setIsModalActive}>
        {emailStatus === "success" ? (
          <div className="flex flex-col items-center gap-4">
            <p>Email sent successfully!</p>
            <Button
              variant="noShadow"
              size="lg"
              onClick={() => {
                setIsModalActive(false);
                setEmailStatus("idle");
                setEmailAddress("");
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              id="emailAddress"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              placeholder="Enter your email address"
              className="input-class" // Adjust this class to match your styling
            />
            {emailStatus === "error" && emailError && (
              <p className="text-red-500">{emailError}</p>
            )}
            <Button
              type="submit"
              variant="neutral"
              size="lg"
              disabled={emailStatus === "loading" || isPendingEmail}
            >
              {emailStatus === "loading" || isPendingEmail
                ? "Sending..."
                : "Send Email"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
