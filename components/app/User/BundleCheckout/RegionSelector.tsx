"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Country, Region } from "@/lib/types";

interface RegionSelectorProps {
  countries: Country[];
  regions: Region[];
  onRegionSelected: (slug: string) => void;
}

export default function RegionSelector({
  countries,
  regions,
  onRegionSelected,
}: RegionSelectorProps) {
  const [query, setQuery] = useState("");

  const filteredCountries =
    query === ""
      ? countries
      : countries.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );

  const filteredRegions =
    query === ""
      ? regions
      : regions.filter((r) =>
          r.name.toLowerCase().includes(query.toLowerCase())
        );

  // Instead of router.push, we call the parent's callback
  const handleSelectCountry = (country: Country) => {
    onRegionSelected(country.slug);
  };

  const handleSelectRegion = (region: Region) => {
    onRegionSelected(region.slug);
  };

  return (
    <Command className="rounded-md border p-2">
      <CommandInput
        placeholder="Type a country or region name..."
        value={query}
        onValueChange={(val) => setQuery(val)}
      />
      <CommandList className="command-scrollbar max-h-64 overflow-auto mt-2">
        {filteredCountries.length === 0 && filteredRegions.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {filteredRegions.length > 0 && (
          <CommandGroup heading="Regions">
            {filteredRegions.map((r) => (
              <CommandItem key={r.slug} onSelect={() => handleSelectRegion(r)}>
                {r.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredCountries.length > 0 && (
          <CommandGroup heading="Countries">
            {filteredCountries.map((c) => (
              <CommandItem key={c.slug} onSelect={() => handleSelectCountry(c)}>
                <span className="mr-2">{c.flag}</span>
                {c.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredCountries.length > 0 && filteredRegions.length > 0 && (
          <CommandSeparator />
        )}
      </CommandList>
    </Command>
  );
}
