"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/SIM/card";

export default function GlobalEsimsTab() {
  return (
    <div className="space-y-4 my-4">
      <h2 className="text-2xl font-semibold text-center">Global eSIMs</h2>
      <div className="grid gap-4 grid-cols-1 ">
        <Link key="global" href={`/esim/data-plans/global`} className="group">
          <Card className="w-[300px] border transition-all   hover:!translate-x-[4px] hover:!translate-y-[4px] hover:shadow-none dark:hover:shadow-none">
            <CardHeader>
              <CardTitle className="flex gap-3 text-xl font-semibold justify-start items-center">
                <span>Global</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
