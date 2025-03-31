import SMSCheckout from "@/components/app/PhoneNumbers/SMSCheckout";
import { Metadata } from "next";
import * as React from "react";

import { FaInfoCircle } from "react-icons/fa";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: {
    default: "LNVPN - Disposable Phone Numbers - $0.4",
    template: "%s | LNVPN",
  },
  description:
    "Get instant disposable phone numbers for SMS verification. Pay with Bitcoin, no KYC required. 20-minute access to receive activation codes.",
  keywords: [
    "disposable phone numbers",
    "SMS verification",
    "Bitcoin payments",
    "privacy",
    "no KYC SMS",
    "anonymous SMS",
    "privacy SMS",
    "instant SMS",
    "temporary phone numbers",
    "Bitcoin",
    "lightning network",
  ],
  authors: [{ name: "LNVPN", url: "https://github.com/lnvpn" }],
  openGraph: {
    type: "website",
    description:
      "Get instant disposable phone numbers for SMS verification. Pay with Bitcoin, no KYC required.",
    images: ["https://lnvpn.net/media/logoPNGLNVPN.png"],
    url: "https://lnvpn.net/",
    title: "LNVPN - Disposable Phone Numbers for SMS Verification",
  },
  metadataBase: new URL("https://lnvpn.net/"),
  twitter: {
    card: "summary_large_image",
    title: "LNVPN - Disposable Phone Numbers for SMS Verification",
    description:
      "Get instant disposable phone numbers for SMS verification. Pay with Bitcoin, no KYC required.",
    images: ["https://lnvpn.net/media/logoPNGLNVPN.png"],
    creator: "@ln_vpn",
  },
};

export default function PhoneNumbers() {
  return (
    <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="my-10 text-shadow-neo text-center scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        Phone Number
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
          <Link className="text-main underline" href={"/faq"}>
            FAQ
          </Link>{" "}
          if you have any questions.
          <br />
          <br />
          Pro Tip: Use{" "}
          <span className="font-bold">
            &quot;Any other call forwarding&quot;
          </span>{" "}
          as service if anything else fails.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap justify-evenly gap-4 my-10">
        <Button
          variant="default"
          size={"lg"}
          asChild
          className="hidden m900:flex text-black"
        >
          <Link href="/esim">eSIM</Link>
        </Button>
        <Button
          variant="default"
          size={"lg"}
          asChild
          className="hidden m900:flex text-black"
        >
          <Link href="/vpn">VPN</Link>
        </Button>
      </div>
    </main>
  );
}
