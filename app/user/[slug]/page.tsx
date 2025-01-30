// app/user/[iccid]/page.tsx
import { EsimInstructionsClient } from "@/components/app/User/EsimInformationClient";
import { fetchEsimBundles, fetchEsimData } from "./userPageActions";
import { Metadata } from "next";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CopyUrlButton } from "@/components/app/User/CopyUrlButton";
import { FaInfoCircle } from "react-icons/fa";
import { EsimBundlesCards } from "@/components/app/User/EsimBundleCards";
import Link from "next/link";
import BundleCheckout from "@/components/app/User/BundleCheckout";
import { getNetworks } from "@/components/app/eSIM/SIMactions";
import { NetworksResponse } from "@/lib/types";

import { buildCountriesAndRegions } from "@/utils/esimUtils";
import { isError } from "@/utils/isError";
import { Suspense } from "react";
import { FaSpinner } from "react-icons/fa6";
import RefreshButton from "@/components/app/RefreshButton";

export const metadata: Metadata = {
  title: {
    default: "LN SIM - Bitcoin eSIM - No KYC - $0.99 Plans",
    template: "%s | LNVPN",
  },
  description:
    "Buy eSIM plans with Bitcoin at LN SIM by LNVPN. Stay connected worldwide with a privacy-first, global eSIM service. Plans starting at just $0.99.",
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const iccid = slug;

  // 1. Fetch eSIM details
  let esimData, bundleData;
  try {
    esimData = await fetchEsimData(iccid);
    bundleData = await fetchEsimBundles(iccid);
  } catch (error: unknown) {
    let errorMessage = "Could not fetch eSIM details.";

    if (isError(error)) {
      errorMessage = error.message;
    }

    return (
      <div className="flex flex-col  justify-center items-center h-screen">
        <h1 className="text-xl font-bold">No eSIM found, try to refresh.</h1>
        <p>Your eSIM number: {iccid}</p>
        <p>{errorMessage}</p>
        <RefreshButton />
      </div>
    );
  }

  // 2. Handle "access denied"
  if (esimData?.message === "Access denied") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold">No eSIM found</h1>
        <p>It looks like this ICCID doesn’t exist or you have no access.</p>
        <RefreshButton />
      </div>
    );
  }

  const bundles = bundleData?.bundles || [];

  // Fetch your networks data to build countries/regions
  let networksData: NetworksResponse | null = null;
  try {
    networksData = await getNetworks();
  } catch (err) {
    console.error("Failed to fetch networks:", err);
  }

  const { countries, regions } = buildCountriesAndRegions(networksData);

  // 5. Return your main UI
  return (
    <main className="flex flex-col items-center gap-4 px-4 mx-auto mt-10 max-w-screen-md">
      <h1 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        LN SIM
      </h1>

      <h2 className="text-xl font-mono font-bold">eSIM - {slug}</h2>
      {/* Alert with info & copy button */}
      <Alert variant={"destructive"} className="w-full mx-auto max-w-screen-md">
        <FaInfoCircle className="h-5 w-5 mr-2" aria-hidden="true" />
        <AlertTitle className="mb-2">This is your eSIM profile page</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            You can add multiple bundles or countries to this profile **without
            having to reinstall** the eSIM.
          </p>
          <p className="mb-4">
            Please bookmark this page! You have no login or password, so keep
            this URL safe if you want to manage your eSIM in the future.
          </p>
          <p className="mt-2">
            Have questions?{" "}
            <Link className="text-main underline" href={"/faq"}>
              Visit our FAQ
            </Link>{" "}
            for more details.
          </p>
          <div className="flex justify-end">
            <CopyUrlButton />
          </div>
        </AlertDescription>
      </Alert>

      {/* eSIM Info */}
      <div className="w-full">
        <Suspense
          fallback={<FaSpinner className="animate-spin h-6 w-6 mr-2" />}
        >
          <EsimInstructionsClient esimData={esimData} />
        </Suspense>
      </div>

      {/* Bundles */}
      <div className="w-full mt-8">
        <hr className="border-black dark:border-white my-4" />
        <Suspense
          fallback={<FaSpinner className="animate-spin h-6 w-6 mr-2" />}
        >
          <EsimBundlesCards bundles={bundles} iccid={iccid} />
        </Suspense>
      </div>

      {/* Our new checkout modal, passing countries + regions */}
      <div className="flex justify-center w-full my-8">
        <Suspense
          fallback={<FaSpinner className="animate-spin h-6 w-6 mr-2" />}
        >
          <BundleCheckout
            iccid={iccid}
            countries={countries}
            regions={regions}
          />
        </Suspense>
      </div>
    </main>
  );
}
