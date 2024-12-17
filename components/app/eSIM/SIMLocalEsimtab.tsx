"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/SIM/card";

interface LocalEsimsTabProps {
  topSellerCountries: {
    code: string;
    name: string;
    flag: string;
    slug: string;
    networks: any[];
  }[];
  allCountries: {
    code: string;
    name: string;
    flag: string;
    slug: string;
    networks: any[];
  }[];
}

export default function LocalEsimsTab({
  topSellerCountries,
  allCountries,
}: LocalEsimsTabProps) {
  const [showAll, setShowAll] = React.useState(false);

  const displayedCountries = showAll
    ? allCountries
    : topSellerCountries.slice(0, 20);

  const headingText = showAll ? "All Countries" : "Top Seller";
  const buttonText = showAll ? "Show only topseller" : "Show 200+ countries";

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-2xl font-semibold">{headingText}</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedCountries.map((c) => (
          <Link key={c.code} href={`/esim/${c.slug}`} className="group">
            <Card className="w-[300px] border transition-all   hover:!translate-x-[4px] hover:!translate-y-[4px] hover:shadow-none dark:hover:shadow-none">
              <CardHeader>
                <CardTitle className="flex gap-3 text-xl font-semibold justify-start items-center">
                  <span className="text-5xl">{c.flag}</span>
                  <span>{c.name}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Button
        variant="neutral"
        size={"lg"}
        className=" bg-white dark:text-white dark:bg-secondaryBlack"
        onClick={() => setShowAll(!showAll)}
      >
        {buttonText}
      </Button>
    </div>
  );
}
