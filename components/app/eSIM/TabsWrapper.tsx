"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./TabComponente";

export default function TabsWrapper() {
  const pathname = usePathname();

  // Determine the active tab based on the current path
  let activeTab = "local";
  if (pathname.startsWith("/esim/regional")) {
    activeTab = "regional";
  } else if (pathname.startsWith("/esim/global")) {
    activeTab = "global";
  }

  return (
    <Tabs value={activeTab} className="text-center">
      <TabsList className="my-4">
        <TabsTrigger value="local">
          <Link href="/esim">Local eSIMs</Link>
        </TabsTrigger>
        <TabsTrigger value="regional">
          <Link href="/esim/regional">Regional eSIMs</Link>
        </TabsTrigger>
        <TabsTrigger value="global">
          <Link href="/esim/global">Global eSIMs</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
