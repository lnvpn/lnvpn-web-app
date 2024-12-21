import { ThemeProvider } from "@/components/app/ThemeProvider";
import Header from "../components/app/Navbar";
import RefProviderWrapper from "./context/RefProviderWrapper";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

import "./globals.css";
import Footer from "@/components/app/Footer";

export const metadata: Metadata = {
  title: {
    default: "Bitcoin VPN Service | LNVPN - Privacy-Focused VPN",
    template: "%s | LNVPN",
  },
  description:
    "Secure your privacy with LNVPN's no-log VPN. Pay with Bitcoin for ultimate anonymity. Plans start at just 10 cents! Get protected today.",
  keywords: [
    "Bitcoin VPN service",
    "anonymous VPN",
    "no-log VPN",
    "VPN accepting Bitcoin",
    "secure VPN",
    "VPN for privacy",
    "pay VPN with Bitcoin",
    "Bitcoin-only VPN",
    "best VPN for cryptocurrency",
    "private VPN service",
  ],
  authors: [{ name: "LNVPN", url: "https://github.com/lnvpn" }],
  openGraph: {
    type: "website",
    url: "https://lnvpn.net/",
    title: "Bitcoin VPN Service | LNVPN - Privacy-Focused VPN",
    description:
      "Secure your privacy with LNVPN's no-log VPN. Pay with Bitcoin for ultimate anonymity. Plans start at just 10 cents! Get protected today.",
    images: [{ url: "/LNVPN-Mask-Logo.svg" }],
  },
  metadataBase: new URL("https://lnvpn.net"),
  twitter: {
    card: "summary_large_image",
    creator: "@ln_vpn",
    title: "Bitcoin VPN Service | LNVPN - Privacy-Focused VPN",
    description:
      "Secure your privacy with LNVPN's no-log VPN. Pay with Bitcoin for ultimate anonymity. Plans start at just 10 cents! Get protected today.",
    images: ["/LNVPN-Mask-Logo.svg"],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  const vpnPrices = {
    hour: 0.1,
    day: 0.5,
    week: 1.5,
    month: 3,
    quarter: 8,
  };

  const vpnEndpoints = [
    {
      country: " United-States",
      isoCode: "US",
    },
    {
      country: " United-Kingdom",
      isoCode: "GB",
    },
    { country: "India", isoCode: "IN" },
    { country: "Netherlands", isoCode: "NL" },
    { country: "Russia", isoCode: "RU" },
    { country: "Ukraine", isoCode: "UA" },
    { country: "Israel", isoCode: "IL" },
    { country: "Kazakhstan", isoCode: "KZ" },
    { country: "Portugal", isoCode: "PT" },
    { country: "Iceland", isoCode: "IS" },
    { country: "Australia", isoCode: "AU" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "LNVPN - Privacy-Focused VPN",
    description:
      "Secure your privacy with LNVPN's no-log VPN. Pay with Bitcoin for ultimate anonymity. Plans start at just 10 cents!",
    provider: {
      "@type": "Organization",
      name: "LNVPN",
      url: "https://lnvpn.net",
    },
    offers: Object.entries(vpnPrices).map(([duration, price]) => ({
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      description: `VPN connection for ${duration}`,
    })),
    areaServed: vpnEndpoints.map((endpoint) => ({
      "@type": "Country",
      name: endpoint.country,
    })),
  };

  return (
    <>
      <html lang="en" className={inter.className}>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="flex flex-col min-h-screen ">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow bg-bg dark:bg-darkBg">
              <RefProviderWrapper>{children}</RefProviderWrapper>
            </main>
            <div id="drawer"></div>
            <div id="modal"></div>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
