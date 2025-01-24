"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FaApple } from "react-icons/fa6";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { refreshEsimAction } from "./UserComponenteActions";
import { IoIosRefresh } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Import the server action

// or wherever you exported refreshEsimAction

interface EsimData {
  iccid?: string;
  pin?: string;
  puk?: string;
  matchingId?: string;
  smdpAddress?: string;
  profileStatus?: "Released" | "Downloaded" | "Installed" | "Unavailable";
  firstInstalledDateTime?: number;
  appleInstallUrl?: string;
  message?: string;
}

export function EsimInstructionsClient({ esimData }: { esimData: EsimData }) {
  const {
    iccid = "",
    pin,
    puk,
    profileStatus,
    firstInstalledDateTime,
    appleInstallUrl,
    matchingId = "",
    smdpAddress = "",
  } = esimData;
  const { toast } = useToast();
  const isInstalled = profileStatus === "Installed";
  const [isOpen, setIsOpen] = useState(!isInstalled);

  // This state can hold any response from the refresh action

  // Construct the eSIM activation string for the QR code
  const qrValue = `LPA:1$${smdpAddress}$${matchingId}`;

  const handleRefreshClick = async () => {
    const response = await refreshEsimAction(iccid);

    if (response.success) {
      toast({
        title: "eSIM Refreshed",
        description: "Your eSIM connection has been refreshed.",
        action: <ToastAction altText="Goto schedule to undo">Ok</ToastAction>,
      });
    } else {
      toast({
        title: "Error",
        description: response.message ?? "Failed to refresh eSIM.",
        action: <ToastAction altText="Goto schedule to undo">Ok</ToastAction>,
      });
    }
  };

  return (
    <div className="space-y-4 text-center w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="mt-2 w-full"
      >
        <div className="flex items-center gap-2 w-full">
          <div className="rounded-base w-full flex items-center justify-between space-x-4 border-2 border-border dark:border-darkBorder text-text bg-main px-4 py-2">
            <div className="flex flex-col items-start">
              <h4 className="font-bold">Installation / eSIM Details</h4>
              <p className="font-semibold">eSIM Status: {profileStatus}</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="noShadow"
                size="sm"
                className="bg-white text-text"
              >
                <ChevronDown />
                <span className="sr-only">Toggle Instructions</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent
          className={`flex flex-col gap-4 my-2 text-text text-center font-base bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder p-4 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-wrap items-center justify-evenly">
            {isInstalled ? (
              <p>This eSIM is now installed.</p>
            ) : (
              <p>
                Your eSIM is not installed at the moment. You can (re)install it
                by scanning a QR code or using the link below (Apple).
              </p>
            )}

            {firstInstalledDateTime ? (
              <p>
                Installed first at:{" "}
                {new Date(firstInstalledDateTime).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            ) : null}

            {/* Show eSIM info */}
            <div className="flex flex-col flex-wrap justify-center items-start text-lg space-y-1">
              <p>
                ICCID: <strong>{iccid || "N/A"}</strong>
              </p>
              <p>
                PIN: <strong>{pin || "N/A"}</strong>
              </p>
              <p>
                PUK: <strong>{puk || "N/A"}</strong>
              </p>
              <p>
                Matching ID: <strong>{matchingId || "N/A"}</strong>
              </p>
              <p>
                SMDP Address: <strong>{smdpAddress || "N/A"}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4 justify-center items-center">
              {appleInstallUrl ? (
                <Link
                  href={appleInstallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <FaApple className="mr-2" />
                    IPhone Quick Install
                  </Button>
                </Link>
              ) : null}

              {/* Generate the actual QR code with the eSIM activation string */}
              <QRCodeSVG
                value={qrValue}
                size={256}
                className="bg-white p-4 border-2 border-border dark:border-darkBorder radius-base"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <p className="text-sm">
              &quot;Disconnect&quot; will disconnect your current eSIM
              connection from the network and reconnect for troubleshooting
              purposes.
            </p>
            <Button variant="neutral" onClick={handleRefreshClick}>
              <IoIosRefresh className="mr-2" />
              Disconnect
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
