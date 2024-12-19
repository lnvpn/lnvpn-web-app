import { Metadata, ResolvingMetadata } from "next";
import { countryNameMap } from "@/data/countryNames";
import { getCountryCodeFromSlug } from "@/utils/esimUtils";

import { getEntityData } from "@/components/app/eSIM/[slug]/SIMDetailPageActions"; // renamed import

import BackButton from "@/components/app/BackButton";
import { countryCodeToEmoji } from "@/utils/esimUtils";

import {
  isCountrySlug,
  isRegionSlug,
  getRegionNameFromSlug,
} from "@/utils/esimUtils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Calendar, Tag, Globe, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConditionsAccordion from "@/components/app/eSIM/[slug]/ConditionsAccordion";

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
  const fallbackDescription = `Discover eSIM plans for ${entityName} with Bitcoin payments. Stay connected with LN-SIM by LNVPN.`;

  return {
    title: hasPlans ? `${entityName} eSIM Plans | LN-SIM` : fallbackTitle,
    description: hasPlans
      ? `Buy eSIM plans for ${entityName}. Enjoy reliable and privacy-focused connectivity with LN-SIM and pay using Bitcoin Lightning Network.`
      : fallbackDescription,
    keywords: [
      "eSIM",
      `${entityName} eSIM`,
      "Bitcoin eSIM",
      "LN-SIM",
      "Lightning Network eSIM",
      "global eSIM",
      "travel eSIM",
      "LNVPN",
    ],
    openGraph: {
      title: hasPlans ? `${entityName} eSIM Plans | LN-SIM` : fallbackTitle,
      description: hasPlans
        ? `Buy eSIM plans for ${entityName} with Bitcoin. Reliable and private connectivity worldwide.`
        : fallbackDescription,
      url: `https://lnvpn.net/esim/${slug}`,
      images: ["https://lnvpn.net/LNVPN-Mask-Logo.svg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hasPlans ? `${entityName} eSIM Plans | LN-SIM` : fallbackTitle,
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

  if (isCountrySlug(slug)) {
    isoCode = getCountryCodeFromSlug(slug)!;
    title = countryNameMap[isoCode];
    flagEmoji = countryCodeToEmoji(isoCode);
  } else if (isRegionSlug(slug)) {
    title = getRegionNameFromSlug(slug)!;
    // No emoji for regions
  } else {
    return (
      <main className="relative flex flex-col gap-4 items-center px-5 flex-grow font-bold">
        <h1 className="text-6xl font-bold my-10">404 - Not found</h1>
        <div className="flex w-full max-w-4xl justify-start">
          <BackButton />
        </div>
      </main>
    );
  }

  const entityData = await getEntityData(slug);

  return (
    <main className="relative flex w-full flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="text-xl md:text-6xl font-bold text-text dark:text-darkText my-10">
        LN SIM
      </h1>
      <div className="flex w-full max-w-4xl justify-start">
        <BackButton />
      </div>
      <h2 className="text-4xl my-10">
        {flagEmoji ? `${flagEmoji} ${title}` : title}
      </h2>

      {entityData && entityData.length > 0 ? (
        <div className="w-full max-w-4xl space-y-4">
          <h3 className="text-2xl font-semibold">Available Data Plans</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {entityData.map((plan, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {plan.countryName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody className="text-lg">
                      <TableRow>
                        <TableCell className=" flex items-center gap-1">
                          <RefreshCcw className="w-4 h-4" /> Data
                        </TableCell>
                        <TableCell>{plan.dataInGB} GB</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className=" flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Duration
                        </TableCell>
                        <TableCell>{plan.durationInDays} days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className=" flex items-center gap-1">
                          <Tag className="w-4 h-4" /> Price
                        </TableCell>
                        <TableCell>
                          <strong>${plan.price}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant={"neutral"}>Buy Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <hr className="w-full my-10 text-black border-black" />
          {isoCode && (
            <div className="flex justify-center">
              <ConditionsAccordion isoCode={isoCode} />
            </div>
          )}
        </div>
      ) : (
        <p>No data available for this entity.</p>
      )}
    </main>
  );
}
