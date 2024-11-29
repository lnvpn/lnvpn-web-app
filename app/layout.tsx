import { ThemeProvider } from "@/components/app/ThemeProvider";
import Header from "../components/app/Navbar";
import RefProviderWrapper from "./context/RefProviderWrapper";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

const inter = Inter({
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
    "LNVPN offers a secure, no-log VPN service accepting Bitcoin payments for ultimate anonymity. Enhance your online privacy with our Bitcoin-only VPN solution.",
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
      "LNVPN offers a secure, no-log VPN service accepting Bitcoin payments for ultimate anonymity. Enhance your online privacy with our Bitcoin VPN solution.",
    images: [{ url: "/LNVPN-Mask-Logo.svg" }],
  },
  metadataBase: new URL("https://lnvpn.net"),
  twitter: {
    card: "summary_large_image",
    creator: "@ln_vpn",
    title: "Bitcoin VPN Service | LNVPN - Privacy-Focused VPN",
    description:
      "LNVPN offers a secure, no-log VPN service accepting Bitcoin payments for ultimate anonymity. Enhance your online privacy with our Bitcoin VPN solution.",
    images: ["/LNVPN-Mask-Logo.svg"],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" className={inter.className}>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
