"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/SIM/card";
import Link from "next/link";
import { regionsMap } from "@/data/countryNames";

export default function RegionsTab() {
  return (
    <div className="space-y-4 my-4">
      <h2 className="text-2xl font-semibold text-center">Regional eSIMs</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {regionsMap.map((region) => (
          <Link
            key={region.slug}
            href={`/esim/data-plans/${region.slug}`}
            className="group"
          >
            <Card className="w-[300px] border transition-all  hover:!translate-x-[4px] hover:!translate-y-[4px] hover:shadow-none dark:hover:shadow-none">
              <CardHeader>
                <CardTitle className="flex gap-3 text-xl font-semibold justify-start items-center">
                  <span>{region.name}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
