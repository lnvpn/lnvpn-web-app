// app/esim/global/page.tsx

import React from "react";
import GlobalEsimsTab from "@/components/app/eSIM/SIMGlobalEsimtab";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LN SIM - Bitcoin eSIM - No KYC - $0.99 Plans ",
    template: "%s | Global Plans",
  },
  description:
    "Buy eSIM plans with Bitcoin at LN SIM by LNVPN. Stay connected worldwide with a privacy-first, global eSIM service. Plans starting at $0.99.",
  keywords: [
    "eSIM",
    "LN SIM",
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
      "Buy global eSIMs with Bitcoin at LN SIM by LNVPN. Stay connected with a privacy-focused eSIM solution.",
    images: ["https://lnvpn.net/media/logoPNGLNVPN.png"],
    url: "https://lnvpn.net/esim",
    title: "LN SIM - Bitcoin eSIM - No KYC - $0.99 Plans",
  },
  metadataBase: new URL("https://lnvpn.net/"),
  twitter: {
    card: "summary_large_image",
    title: "LN SIM - Bitcoin eSIM - No KYC - $0.99 Plans",
    description:
      "Buy global eSIMs with Bitcoin at LN SIM by LNVPN. A privacy-first service for seamless global connectivity.",
    images: ["https://lnvpn.net/media/logoPNGLNVPN.png"],
    creator: "@ln_vpn",
  },
};

export const revalidate = 360000;

export default function GlobalPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <GlobalEsimsTab />
    </div>
  );
}
