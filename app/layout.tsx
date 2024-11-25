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
    default: "LNVPN - The Bitcoin VPN",
    template: "%s | LNVPN",
  },
  description:
    "A privacy-focused VPN service. Bitcoin only payments for maximum privacy.",
  keywords: [
    "privacy-focused VPN",
    "VPN service",
    "Bitcoin payments",
    "privacy",
    "disposable phone numbers",
    "SMS verification",
    "Bitcoin payments",
    "VPN",
    "Bitcoin",
    "lightning network",
  ],
  authors: [{ name: "LNVPN", url: "https://github.com/lnvpn" }],
  openGraph: {
    type: "website",
    description:
      "A privacy-focused VPN service. Bitcoin only payments for maximum privacy.",
    images: [{ url: "/LNVPN-Mask-Logo.svg" }],
    url: "https://lnvpn.net/",
    title: "LNVPN - The Bitcoin VPN",
  },
  metadataBase: new URL("https://lnvpn.net"),
  twitter: {
    card: "summary_large_image",
    title: "LNVPN - The Bitcoin VPN",
    description: "A privacy-focused VPN service.",
    images: ["/LNVPN-Mask-Logo.svg"],
    creator: "@ln_vpn",
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
