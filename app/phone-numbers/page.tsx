import SMSCheckout from "@/components/app/PhoneNumbers/SMSCheckout";
import { Metadata } from "next";
import * as React from "react";

export interface IAppProps {}
import { FaInfoCircle } from "react-icons/fa";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "LN-SMS - Bitcoin Disposable Phone Numbers",
    template: "%s | LNVPN",
  },
  description:
    "Get disposable phone numbers for SMS verification. Pay with Bitcoin. 1 Dollar per number.",
  keywords: [
    "disposable phone numbers",
    "SMS verification",
    "Bitcoin payments",
    "privacy",
    "VPN",
    "Bitcoin",
    "lightning network",
  ],
  authors: [{ name: "LNVPN", url: "https://github.com/lnvpn" }],
  openGraph: {
    type: "website",
    description:
      "Get disposable phone numbers for SMS verification. Pay with Bitcoin",
    images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
    url: "https://lnvpn.net/",
    title: "LNVPN - Disposable Phone Numbers",
  },
  metadataBase: new URL("https://lnvpn.net/"),
  twitter: {
    card: "summary_large_image",
    title: "LNVPN - Disposable Phone Numbers",
    description: "A privacy-focused VPN service.",
    images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
    creator: "@ln_vpn",
  },
};

export default function PhoneNumbers() {
  return (
    <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="text-6xl font-bold text-text dark:text-darkText my-10">
        LN SMS
      </h1>

      <SMSCheckout />
      <Alert
        variant={"destructive"}
        className="w-full mx-auto mt-10 max-w-screen-md"
      >
        <FaInfoCircle className="h-5 w-5 " />
        <AlertDescription>
          This is a service that gives you 20 minutes access to a disposable
          phone number to receive activation codes. Select the country and
          service you need, and pay with Bitcoin. Check out our{" "}
          <Link className="text-main" href={"/faq"}>
            FAQ
          </Link>{" "}
          if you have any questions.
        </AlertDescription>
      </Alert>
    </main>
  );
}
