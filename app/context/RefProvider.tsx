"use client";

import React, { createContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type RefContextType = {
  ref: string | null;
};

export const RefContext = createContext<RefContextType>({ ref: null });

// Storage key for sessionStorage (only persists during current session)
const REF_STORAGE_KEY = "lnvpn_referral_code";

export const RefProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    // Try to get referral code from URL parameter first
    const refParam = searchParams.get("ref");

    if (refParam) {
      // If we have a referral code in the URL, store it in sessionStorage and state
      try {
        sessionStorage.setItem(REF_STORAGE_KEY, refParam);
        setRef(refParam);
      } catch (e) {
        // Handle sessionStorage errors gracefully
        console.error("Failed to store referral code:", e);
        setRef(refParam); // Still set in state even if storage fails
      }
    } else if (!ref) {
      // If not in URL and not already in state, try to retrieve from sessionStorage
      try {
        const storedRef = sessionStorage.getItem(REF_STORAGE_KEY);
        if (storedRef) {
          setRef(storedRef);
        }
      } catch (e) {
        // Handle sessionStorage errors
        console.error("Failed to retrieve referral code:", e);
      }
    }
  }, [searchParams, ref]);

  return <RefContext.Provider value={{ ref }}>{children}</RefContext.Provider>;
};
