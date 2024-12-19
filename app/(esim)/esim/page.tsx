import { getNetworks } from "@/components/app/eSIM/SIMactions";
import { NetworksResponse } from "@/lib/types";
import { countryNameMap } from "@/data/countryNames";
import { countryCodeToEmoji, slugify } from "@/utils/esimUtils";
import LocalEsimsTab from "@/components/app/eSIM/SIMLocalEsimtab";
import { Metadata } from "next";

const topSellers = [
  "US",
  "DE",
  "GB",
  "FR",
  "CA",
  "AU",
  "JP",
  "IT",
  "ES",
  "CN",
  "BR",
  "IN",
  "ZA",
  "MX",
  "RU",
  "KR",
  "AE",
  "CH",
  "SE",
  "NL",
];

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

export default async function LocalPage() {
  const networksData: NetworksResponse | null = await getNetworks();

  if (
    !networksData ||
    !Array.isArray(networksData.countryNetworks) ||
    networksData.countryNetworks.length === 0
  ) {
    return (
      <main className="p-4">
        <h1 className="text-3xl font-bold mb-6">eSIM Networks</h1>
        <div>No networks available or an error occurred.</div>
      </main>
    );
  }

  // Prepare country data: full name & flag
  const allCountries = networksData.countryNetworks.map((c) => {
    const code = c.name.toUpperCase();
    const fullName = countryNameMap[code] || code;
    const flag = countryCodeToEmoji(code);
    const slug = slugify(fullName);
    return { code, name: fullName, flag, slug, networks: c.networks };
  });

  // Sort all countries alphabetically by name
  const sortedCountries = [...allCountries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Filter top sellers
  const topSellerCountries = topSellers
    .map((code) => sortedCountries.find((c) => c.code === code))
    .filter(Boolean) as typeof sortedCountries;
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <LocalEsimsTab
        topSellerCountries={topSellerCountries}
        allCountries={sortedCountries}
      />
    </div>
  );
}
