"use client";

import React from "react";
import { RefProvider } from "./RefProvider";

export default function RefProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RefProvider>{children}</RefProvider>;
}
