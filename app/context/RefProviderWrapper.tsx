"use client";

import React, { Suspense } from "react";
import { RefProvider } from "./RefProvider";

export default function RefProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <RefProvider>{children}</RefProvider>
    </Suspense>
  );
}
