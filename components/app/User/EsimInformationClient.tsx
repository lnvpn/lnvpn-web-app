"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Copy, CheckCircle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [copied, setCopied] = useState(false);

  // This state can hold any response from the refresh action

  // Construct the eSIM activation string for the QR code
  const qrValue = `LPA:1$${smdpAddress}$${matchingId}`;
  const manualActivationCode = `LPA:1$${smdpAddress}$${matchingId}`;

  // For QR code fallback
  const [qrBackground, setQrBackground] = useState("#ffffff");
  const [qrForeground, setQrForeground] = useState("#000000");

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text: " + err,
          variant: "destructive",
        });
      }
    );
  };

  // Toggle QR code colors for better visibility on different browsers/themes
  const toggleQrCodeColors = () => {
    if (qrBackground === "#ffffff") {
      setQrBackground("#000000");
      setQrForeground("#ffffff");
    } else {
      setQrBackground("#ffffff");
      setQrForeground("#000000");
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
                using one of the methods below.
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
          </div>

          <div className="w-full max-w-2xl mx-auto mt-6">
            <Tabs defaultValue="qr">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="android">Android</TabsTrigger>
                <TabsTrigger value="apple">iPhone</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Installation</CardTitle>
                    <CardDescription>
                      Scan this QR code using your phone&apos;s camera or eSIM
                      settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {/* Generate the actual QR code with the eSIM activation string */}
                    <QRCodeSVG
                      value={qrValue}
                      size={256}
                      bgColor={qrBackground}
                      fgColor={qrForeground}
                      className="p-4 border-2 border-border dark:border-darkBorder radius-base"
                    />
                    <Button
                      variant="neutral"
                      size="sm"
                      onClick={toggleQrCodeColors}
                      className="mt-2"
                    >
                      Toggle QR Colors
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="android" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Android Manual Installation</CardTitle>
                    <CardDescription>
                      Follow these steps to install your eSIM manually on an
                      Android device
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ol className="list-decimal list-inside text-left space-y-2">
                        <li>
                          Go to <strong>Settings</strong> on your device
                        </li>
                        <li>
                          Tap on <strong>Network & Internet</strong>
                        </li>
                        <li>
                          Tap the <strong>Add</strong> or <strong>+</strong>{" "}
                          icon next to <strong>Mobile Network</strong>
                        </li>
                        <li>
                          Tap <strong>Next</strong> when asked &quot;Don&apos;t
                          have a SIM card?&quot;
                        </li>
                        <li>
                          Tap <strong>Enter Code Manually</strong>
                        </li>
                        <li>
                          Enter the SM-DP+ Address and Activation Code below:
                        </li>
                      </ol>

                      <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between mt-2">
                        <div className="text-sm font-mono break-all">
                          {manualActivationCode}
                        </div>
                        <Button
                          size="sm"
                          variant="neutral"
                          onClick={() => copyToClipboard(manualActivationCode)}
                          className="ml-2"
                        >
                          {copied ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <ol
                        className="list-decimal list-inside text-left space-y-2"
                        start={7}
                      >
                        <li>
                          Turn on your eSIM under{" "}
                          <strong>Mobile Network</strong>
                        </li>
                        <li>
                          Enable <strong>Mobile data</strong>
                        </li>
                        <li>
                          Enable <strong>Data Roaming</strong>
                        </li>
                        <li>
                          Set up an <strong>APN</strong> on your device if
                          required
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="apple" className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>iPhone Quick Install</CardTitle>
                    <CardDescription>
                      Use the dedicated Apple installation link
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {appleInstallUrl ? (
                      <Link
                        href={appleInstallUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full">
                          <FaApple className="mr-2" />
                          iPhone Quick Install
                        </Button>
                      </Link>
                    ) : (
                      <p>
                        Apple installation link is not available for this eSIM.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
