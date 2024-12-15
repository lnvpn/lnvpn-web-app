import * as React from "react";
import { Metadata } from "next";
export interface IAppProps {}

export const metadata: Metadata = {
  title: {
    default: "LN-SIM - Bitcoin eSIM for Global Connectivity",
    template: "%s | LNVPN",
  },
  description:
    "Buy eSIM plans with Bitcoin at LN-SIM by LNVPN. Stay connected worldwide with a privacy-first, global eSIM service. Plans starting at just 5 dollars.",
  keywords: [
    "eSIM",
    "LN-SIM",
    "Bitcoin eSIM",
    "Lightning Network eSIM",
    "global eSIM",
    "privacy eSIM",
    "Bitcoin payments",
    "cryptocurrency eSIM",
    "travel eSIM",
    "prepaid eSIM",
    "LNVPN",
    "LnVPN eSIM",
  ],
  authors: [{ name: "LNVPN", url: "https://github.com/lnvpn" }],
  openGraph: {
    type: "website",
    description:
      "Buy global eSIMs with Bitcoin at LN-SIM by LNVPN. Stay connected with a privacy-focused eSIM solution.",
    images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
    url: "https://lnvpn.net/esim",
    title: "LN-SIM - Bitcoin eSIM for Global Connectivity",
  },
  metadataBase: new URL("https://lnvpn.net/"),
  twitter: {
    card: "summary_large_image",
    title: "LN-SIM - Bitcoin eSIM for Global Connectivity",
    description:
      "Buy global eSIMs with Bitcoin at LN-SIM by LNVPN. A privacy-first service for seamless global connectivity.",
    images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
    creator: "@ln_vpn",
  },
};

export default function SIM() {
  return (
    <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="text-6xl font-bold text-text dark:text-darkText my-10">
        LN SIM
      </h1>
      <div className="w-2/4">
        <h2 className="my-10 text-4xl ">
          Buy eSIM plans for global connectivity using Bitcoin. Privacy-focused,
          secure, and convenient.
        </h2>
      </div>
    </main>
  );
}
