import { Metadata } from "next";
import { countryNameMap } from "@/data/countryNames";
import { getCountryCodeFromSlug } from "@/utils/esimUtils";
import {
  FaUserShield,
  FaBolt,
  FaEnvelopeOpenText,
  FaUserSlash,
  FaWifi,
  FaGlobe,
  FaDatabase,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaQrcode,
  FaTachometerAlt,
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
import { NetworkInfo } from "@/lib/types";
import { FaSpinner } from "react-icons/fa6";
import RegionalBadges from "@/components/app/eSIM/[slug]/RegionalBadges";

export const revalidate = 360000;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
  const cheapestPrice: number = hasPlans
    ? Math.min(...entityData.map((plan) => plan.price))
    : 0.99;

  const fallbackTitle = `LNVPN - $${cheapestPrice.toFixed(
    2
  )} eSIM Plans for ${entityName}`;
  const fallbackDescription = `Discover eSIM plans for ${entityName} with Bitcoin payments. Stay connected with LNVPN. Plans starting at just $${cheapestPrice.toFixed(
    2
  )}.`;

  return {
    title: hasPlans
      ? `LNVPN - $${cheapestPrice.toFixed(2)} ${entityName} eSIM Plans`
      : fallbackTitle,
    description: hasPlans
      ? `Buy affordable eSIM plans for ${entityName} starting at $${cheapestPrice.toFixed(
          2
        )}. Enjoy reliable and privacy-focused connectivity with LNVPN and pay using Bitcoin Lightning Network.`
      : fallbackDescription,
    keywords: [
      "eSIM",
      `${entityName} eSIM`,
      "Bitcoin eSIM",
      "LNVPN",
      "Lightning Network eSIM",
      "global eSIM",
      "travel eSIM",
      "cheap eSIM",
      `${entityName} data plan`,
      "no KYC eSIM",
      "private eSIM",
    ],
    alternates: {
      canonical: `https://lnvpn.net/esim/data-plans/${slug}`,
    },
    openGraph: {
      title: hasPlans
        ? `LNVPN - $${cheapestPrice.toFixed(2)} ${entityName} eSIM Plans`
        : fallbackTitle,
      description: hasPlans
        ? `Buy affordable eSIM plans for ${entityName} starting at $${cheapestPrice.toFixed(
            2
          )}. Private and secure connectivity with Bitcoin payments.`
        : fallbackDescription,
      url: `https://lnvpn.net/esim/data-plans/${slug}`,
      images: [
        {
          url: "https://lnvpn.net/media/logoPNGLNVPN.png",
          width: 1200,
          height: 630,
          alt: `${entityName} eSIM Plans - LNVPN`,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: hasPlans
        ? `LNVPN - $${cheapestPrice.toFixed(2)} ${entityName} eSIM Plans`
        : fallbackTitle,
      description: hasPlans
        ? `Get the best eSIM plans for ${entityName}. Pay securely with Bitcoin Lightning Network.`
        : fallbackDescription,
      images: [
        {
          url: "https://lnvpn.net/media/logoPNGLNVPN.png",
          alt: `${entityName} eSIM Plans - LNVPN`,
        },
      ],
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
  let countryNetworkData: NetworkInfo[] = [];

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
          name: `${title} eSIM Data Plan`,
          description: `Affordable ${title} eSIM plans with Bitcoin payments. Instant delivery and privacy-focused connectivity starting at $0.99.`,
          image: ["https://lnvpn.net/esim-icon.svg"],
          brand: {
            "@type": "Brand",
            name: "LNVPN",
          },
          aggregateRating:
            entityData.length > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  reviewCount: "45",
                  bestRating: "5",
                }
              : undefined,
          category: "eSIM Data Plans",
          slogan: "Affordable eSIMs with Bitcoin payments and no KYC",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: Math.min(...entityData.map((plan) => plan.price)).toFixed(
              2
            ),
            highPrice: Math.max(
              ...entityData.map((plan) => plan.price)
            ).toFixed(2),
            offerCount: entityData.length,
            offers: entityData.map((plan) => ({
              "@type": "Offer",
              priceCurrency: "USD",
              description:
                plan.description ||
                `${extractDataAmount(
                  plan.name
                )} data valid for ${extractDuration(
                  plan.name
                )} days in ${title}`,
              name: formatPlanName(plan.name, title),
              price: plan.price.toFixed(2),
              acceptedPaymentMethod: {
                "@type": "PaymentMethod",
                name: "Bitcoin Lightning Network",
              },
              availability: "https://schema.org/InStock",
              url: `https://lnvpn.net/esim/data-plans/${slug}`,
              validFrom: new Date().toISOString(),
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: "0",
                  currency: "USD",
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: "0",
                    maxValue: "1",
                    unitCode: "MIN",
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: "0",
                    maxValue: "1",
                    unitCode: "MIN",
                  },
                },
              },
              additionalProperty: [
                {
                  "@type": "PropertyValue",
                  name: "No KYC Required",
                  value: "True",
                },
                {
                  "@type": "PropertyValue",
                  name: "Instant Delivery",
                  value: "True",
                },
                {
                  "@type": "PropertyValue",
                  name: "Data Amount",
                  value: extractDataAmount(plan.name),
                },
                {
                  "@type": "PropertyValue",
                  name: "Validity Period",
                  value: `${extractDuration(plan.name)} days`,
                },
              ],
            })),
          },
        }
      : null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I activate my eSIM for " + title + "?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Activation is simple: After purchase, you'll receive a QR code. Scan it with your device, follow the on-screen instructions, and you'll be connected within minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Why are LNVPN eSIMs more affordable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We keep costs low by eliminating unnecessary overhead, accepting Bitcoin payments, and negotiating directly with carriers. This allows us to offer competitive pricing without compromising on quality or coverage.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to provide ID or create an account to buy an eSIM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. LNVPN requires no KYC (Know Your Customer), no email, and no account creation. Simply select your plan, pay with Bitcoin, and receive your eSIM instantly.",
        },
      },
      {
        "@type": "Question",
        name: "Which networks does the " + title + " eSIM use?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Our eSIMs connect to premium local networks to ensure reliable coverage. Check the Networks section on this page for specific carrier information in " +
            title +
            ".",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to receive my " + title + " eSIM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Delivery is instant. Once your Bitcoin payment is confirmed on the Lightning Network, you'll immediately receive your eSIM QR code to activate on your device.",
        },
      },
      {
        "@type": "Question",
        name: "Are $0.99 eSIM plans available for " + title + "?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We offer various affordable plans for " +
            title +
            ", with prices starting as low as $0.99 depending on data needs and duration. Check the available data plans section for current pricing.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lnvpn.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "eSIM",
        item: "https://lnvpn.net/esim",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Data Plans",
        item: "https://lnvpn.net/esim/data-plans",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
        item: `https://lnvpn.net/esim/data-plans/${slug}`,
      },
    ],
  };

  return (
    <main className="relative flex w-full flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h2 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        eSIM
      </h2>
      <div className="flex w-full max-w-4xl justify-start">
        <BackButton />
      </div>
      <h1 className="text-xl md:text-4xl my-8 text-center">
        {flagEmoji ? `${flagEmoji} ${title}` : title} - eSIM Data Plans
      </h1>
      <Alert
        variant={"destructive"}
        className="w-full mx-auto my-10 max-w-screen-md"
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
      <div className="flex justify-center items-start w-full lg:max-w-4xl md:gap-4 flex-wrap sm:flex-nowrap gap-2">
        <div className="w-1/2 flex-grow h-full flex flex-col justify-center items-center bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border p-4 lg:m-8">
          <div className="flex flex-col items-center m-4 p-4">
            <Image
              src="/esim-icon.svg"
              width={200}
              height={200}
              alt={`${title} eSIM Data Plan - LNVPN`}
              placeholder="empty"
              priority
            />
          </div>
          {isCountrySlug(slug) && <RegionalBadges slug={slug} />}
          <hr className="w-full border-border  mb-8" />

          <h2 className="text-2xl font-bold text-center mb-6">
            {flagEmoji ? `${flagEmoji} ${title}` : title} - eSIM
          </h2>

          <div className="font-semibold text-lg mb-4">
            <ul className="space-y-4">
              {isoCode && countryNetworkData.length > 0 && (
                <li className="flex items-start gap-4">
                  <FaWifi className="mt-1 flex-shrink-0" />
                  <span>{countryNetworkData.length} network(s) supported</span>
                </li>
              )}
              {isRegionSlug(slug) && entityData && entityData.length > 0 && (
                <li className="flex items-start gap-4">
                  <FaGlobe className="mt-1 flex-shrink-0" />
                  <span>
                    {entityData[0].roamingEnabled.length} countries included
                  </span>
                </li>
              )}
              <li className="flex items-start gap-4">
                <FaDatabase className="mt-1 flex-shrink-0" />
                <span>Data-only service with hotspot functionality</span>
              </li>
              <li className="flex items-start gap-4">
                <FaCalendarAlt className="mt-1 flex-shrink-0" />
                <span>
                  Validity period starts only when used in assigned location
                </span>
              </li>
              <li className="flex items-start gap-4">
                <FaMoneyBillWave className="mt-1 flex-shrink-0" />
                <span>Top-up available </span>
              </li>
              <li className="flex items-start gap-4">
                <FaQrcode className="mt-1 flex-shrink-0" />
                <span>One click installation</span>
              </li>
              <li className="flex items-start gap-4">
                <FaTachometerAlt className="mt-1 flex-shrink-0" />
                <span>High-speed connectivity</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex flex-grow flex-col justify-center items-center gap-3 my-8">
          <h3 className="text-xl font-semibold">Available Data Plans</h3>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <FaSpinner className="animate-spin text-4xl" />
              </div>
            }
          >
            {entityData && entityData.length > 0 ? (
              <div className="w-full max-w-4xl space-y-4">
                <ESIMPageClient plans={entityData} />

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
          </Suspense>
        </div>
      </div>
      {/* Replace the commented-out card section with the RadioGroup */}
    </main>
  );
}

function extractDataAmount(planName: string): string {
  const match = planName.match(/(\d+)GB/i);
  if (match) return `${match[1]}GB`;

  const matchMB = planName.match(/(\d+)MB/i);
  if (matchMB) return `${matchMB[1]}MB`;

  return "Data";
}

function extractDuration(planName: string): string {
  const match = planName.match(/(\d+)D/i);
  return match ? match[1] : "30";
}

function formatPlanName(planName: string, countryName: string): string {
  const dataAmount = extractDataAmount(planName);
  const duration = extractDuration(planName);

  return `${dataAmount} ${countryName} eSIM (${duration} days)`;
}
