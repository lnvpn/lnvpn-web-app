import { Metadata, ResolvingMetadata } from "next";
import { countryNameMap } from "@/data/countryNames";
import { getCountryCodeFromSlug } from "@/utils/esimUtils";
import {
  FaUserShield,
  FaBolt,
  FaEnvelopeOpenText,
  FaUserSlash,
} from "react-icons/fa";
import {
  getCountryNetworkData,
  getEntityData,
} from "@/components/app/eSIM/[slug]/SIMDetailPageActions";

import BackButton from "@/components/app/BackButton";
import { countryCodeToEmoji } from "@/utils/esimUtils";

import {
  isCountrySlug,
  isRegionSlug,
  getRegionNameFromSlug,
} from "@/utils/esimUtils";

import { Suspense } from "react";
import NetworksAccordion from "@/components/app/eSIM/[slug]/NetworksAccordion";
import RoamingAccordion from "@/components/app/eSIM/[slug]/RoamingAccordion";
import Image from "next/image";
import ESIMPageClient from "./ESIMPageClient";
import { Alert } from "@/components/ui/alert";
import DescriptionAccordion from "@/components/app/eSIM/[slug]/DescriptionAccordion";
import TechnicalSpecAccordion from "@/components/app/eSIM/[slug]/TechnicalSpecAccordion";
import RedeemInstructionsAccordion from "@/components/app/eSIM/[slug]/RedeemInstructionsAccordion";

export const revalidate = 360000;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  let entityName: string;
  if (isCountrySlug(slug)) {
    const isoCode = getCountryCodeFromSlug(slug)!;
    entityName = countryNameMap[isoCode] || "Unknown Country";
  } else if (isRegionSlug(slug)) {
    entityName = getRegionNameFromSlug(slug)!;
  } else {
    entityName = "Unknown Entity";
  }

  const entityData = await getEntityData(slug);
  const hasPlans = entityData && entityData.length > 0;

  const fallbackTitle = `eSIM Plans for ${entityName} | LNVPN`;
  const fallbackDescription = `Discover eSIM plans for ${entityName} with Bitcoin payments. Stay connected with LN SIM by LNVPN.`;

  return {
    title: hasPlans ? `${entityName} eSIM Plans | LN SIM` : fallbackTitle,
    description: hasPlans
      ? `Buy eSIM plans for ${entityName}. Enjoy reliable and privacy-focused connectivity with LN SIM and pay using Bitcoin Lightning Network.`
      : fallbackDescription,
    keywords: [
      "eSIM",
      `${entityName} eSIM`,
      "Bitcoin eSIM",
      "LN SIM",
      "Lightning Network eSIM",
      "global eSIM",
      "travel eSIM",
      "LNVPN",
    ],
    openGraph: {
      title: hasPlans ? `${entityName} eSIM Plans | LN SIM` : fallbackTitle,
      description: hasPlans
        ? `Buy eSIM plans for ${entityName} with Bitcoin. Reliable and private connectivity worldwide.`
        : fallbackDescription,
      url: `https://lnvpn.net/esim/${slug}`,
      images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hasPlans ? `${entityName} eSIM Plans | LN SIM` : fallbackTitle,
      description: hasPlans
        ? `Get the best eSIM plans for ${entityName}. Pay securely with Bitcoin Lightning Network.`
        : fallbackDescription,
      images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
      creator: "@ln_vpn",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title: string;
  let flagEmoji: string | null = null;
  let isoCode: string | null = null;
  let countryNetworkData: any[] = [];

  if (isCountrySlug(slug)) {
    isoCode = getCountryCodeFromSlug(slug)!;
    title = countryNameMap[isoCode];
    flagEmoji = countryCodeToEmoji(isoCode);
  } else if (isRegionSlug(slug)) {
    title = getRegionNameFromSlug(slug)!;
  } else {
    return (
      <main className="relative flex flex-col gap-4 items-center px-5 flex-grow font-bold">
        <h1 className="my-10  scroll-m-20  text-5xl font-extrabold tracking-wide text-black lg:text-6xl">
          404 - Not found
        </h1>
        <div className="flex w-full max-w-4xl justify-start">
          <BackButton />
        </div>
      </main>
    );
  }

  const entityData = await getEntityData(slug);
  if (isoCode) {
    countryNetworkData = (await getCountryNetworkData(isoCode)) || [];
  }

  const jsonLd =
    entityData && entityData.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${title} eSIM Plan`,
          description: `Explore ${title} eSIM plans with Bitcoin payments. Instant delivery and privacy-focused connectivity.`,
          images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
          brand: {
            "@type": "Brand",
            name: "LN SIM",
          },
          offers: entityData.map((plan) => ({
            "@type": "Offer",
            priceCurrency: "USD",
            description: plan.description,
            name: plan.name,
            price: plan.price.toFixed(2),
            acceptedPaymentMethod: "Bitcoin",
            availability: "https://schema.org/InStock",
            url: `https://lnvpn.net/esim/data-plans/${slug}`,
          })),
        }
      : null;

  return (
    <main className="relative flex w-full flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <h1 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        LN SIM
      </h1>
      <div className="flex w-full max-w-4xl justify-start">
        <BackButton />
      </div>
      <h2 className="text-xl md:text-4xl my-8">
        {flagEmoji ? `${flagEmoji} ${title}` : title} - eSIM Data Plans
      </h2>
      <Alert
        variant={"destructive"}
        className="w-full mx-auto mt-10 max-w-screen-md"
      >
        <div className="flex justify-center items-center flex-wrap gap-3 ">
          <div className="flex items-center gap-2">
            <FaUserShield />
            <p>No KYC</p>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelopeOpenText />
            <p>No Email</p>
          </div>
          <div className="flex items-center gap-2">
            <FaUserSlash />
            <p>No Account</p>
          </div>
          <div className="flex items-center gap-2">
            <FaBolt />
            <p>Instant delivery</p>
          </div>
        </div>
      </Alert>
      <div className="flex justify-center items-start w-full lg:max-w-4xl md:gap-4 flex-wrap sm:flex-nowrap ">
        <div className="w-1/2 flex-grow  h-full aspect-square flex flex-col justify-center items-center bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder p-4 m-8">
          <Image
            src="/esim-icon.svg"
            width={200}
            height={200}
            alt="ESim Picture"
            placeholder="empty"
            className="w-1/2 h-1/2 "
          />
        </div>
        <div className="w-1/2 flex flex-grow flex-col justify-center items-center gap-3 my-8">
          <h3 className="text-xl font-semibold">Available Data Plans</h3>
          {entityData && entityData.length > 0 ? (
            <div className="w-full max-w-4xl space-y-4">
              <Suspense fallback={<p>Loading...</p>}>
                <ESIMPageClient plans={entityData} />
              </Suspense>
              <hr className="w-full text-black border-black" />
              <div className="flex flex-col gap-1">
                {isoCode && (
                  <div className="flex justify-center">
                    <NetworksAccordion networks={countryNetworkData} />
                  </div>
                )}
                {isRegionSlug(slug) && (
                  <div className="flex justify-center">
                    <RoamingAccordion bundleDataList={entityData} />
                  </div>
                )}
                <div className="flex justify-center">
                  <DescriptionAccordion />
                </div>
                <div className="flex justify-center">
                  <TechnicalSpecAccordion />
                </div>
                <div className="flex justify-center">
                  <RedeemInstructionsAccordion />
                </div>
              </div>
            </div>
          ) : (
            <p>No data available for this entity.</p>
          )}
        </div>
      </div>
      {/* Replace the commented-out card section with the RadioGroup */}
    </main>
  );
}
