// app/esim/[countrySlug]/layout.tsx

import React from "react";

interface CountryLayoutProps {
  children: React.ReactNode;
}

export default async function CountryLayout({ children }: CountryLayoutProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {/* Render the product detail content */}
      {children}
    </div>
  );
}
