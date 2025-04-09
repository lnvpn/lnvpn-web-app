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
    default: "LNVPN - Global eSIM - No KYC - $0.99 Plans",
    template: "%s | LNVPN",
  },
  description:
    "Buy eSIM data plans for 200+ countries with Bitcoin at LNVPN. Get instant activation, no KYC required, and stay connected worldwide. Plans starting at just $0.99. Perfect for travelers and digital nomads.",
  keywords: [
    "eSIM",
    "LNVPN",
    "Bitcoin eSIM",
    "Lightning Network eSIM",
    "global eSIM",
    "privacy eSIM",
    "Bitcoin payments",
    "cryptocurrency eSIM",
    "travel eSIM",
    "prepaid eSIM",
    "LNVPN eSIM",
    "African eSIM",
    "European eSIM",
    "Asian eSIM",
    "American eSIM",
    "international eSIM",
    "data plans",
    "mobile data",
    "roaming free",
    "digital nomad eSIM",
    "travel internet",
    "global data plans",
    "country specific eSIM",
    "regional eSIM",
    "local eSIM",
    "international data plans",
  ],
  authors: [{ name: "LNVPN", url: "https://github.com/lnvpn" }],
  openGraph: {
    type: "website",
    description:
      "Buy global eSIMs with Bitcoin at LNVPN. Stay connected with a privacy-focused eSIM solution.",
    images: ["https://lnvpn.net/media/logoPNGLNVPN.png"],
    url: "https://lnvpn.net/esim",
    title: "LNVPN - Bitcoin eSIM - No KYC - $0.99 Plans",
  },
  metadataBase: new URL("https://lnvpn.net/"),
  twitter: {
    card: "summary_large_image",
    title: "LNVPN - Bitcoin eSIM - No KYC - $0.99 Plans",
    description:
      "Buy global eSIMs with Bitcoin at LNVPN. A privacy-first service for seamless global connectivity.",
    images: ["https://lnvpn.net/media/logoPNGLNVPN.png"],
    creator: "@ln_vpn",
  },
};

export const revalidate = 360000;

export default async function LocalPage() {
  const networksData: NetworksResponse | null = await getNetworks();

  if (
    !networksData ||
    !Array.isArray(networksData.countryNetworks) ||
    networksData.countryNetworks.length === 0
  ) {
    return (
      <main className="p-4 text-center">
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
