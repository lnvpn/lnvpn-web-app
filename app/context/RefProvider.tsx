"use client";

import React, { createContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type RefContextType = {
  ref: string | null;
};

export const RefContext = createContext<RefContextType>({ ref: null });

export const RefProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) {
      setRef(refParam);
    }
  }, [searchParams]);

  return <RefContext.Provider value={{ ref }}>{children}</RefContext.Provider>;
};
