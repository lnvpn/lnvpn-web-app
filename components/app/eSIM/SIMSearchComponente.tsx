"use client";

import { Search as SearchIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Country, Region } from "@/lib/types";

interface SearchProps {
  countries: Country[];
  regions: Region[];
}

export default function Search({ countries, regions }: SearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter countries and regions based on the query
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

  // Handlers for selecting a country or a region
  const onSelectCountry = useCallback(
    (country: Country) => {
      setOpen(false);
      router.push(`/esim/data-plans/${country.slug}`);
    },
    [router]
  );

  const onSelectRegion = useCallback(
    (region: Region) => {
      setOpen(false);
      router.push(`/esim/data-plans/${region.slug}`);
    },
    [router]
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="relative bg-white dark:text-white dark:bg-secondaryBlack shadow-nav dark:shadow-navDark hover:!translate-x-[4px] hover:!translate-y-[4px] hover:shadow-none dark:hover:shadow-none px-5 sm:pr-2 md:pr-20 h-[44px] text-lg shrink-0"
      >
        <span className="mx-2">
          <SearchIcon className="h-5 w-5 " />
        </span>
        <span className="">Search countries or regions...</span>

        <span className="absolute m900:hidden text-black border text-base px-1 py-0.5 border-black rounded-base bg-main h-[28px] right-2 top-1.5">
          ⌘K
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden rounded-none border-0 p-0">
          {/* Hidden Dialog Header */}
          <DialogHeader className="hidden">
            <DialogTitle>Search for country or region</DialogTitle>
            <DialogDescription>
              Select a country or region to view available eSIM data plans.
            </DialogDescription>
          </DialogHeader>
          <Command className="rounded-none">
            <CommandInput
              placeholder="Type a country or region name..."
              value={query}
              onValueChange={(val) => setQuery(val)}
            />
            <CommandList className="command-scrollbar">
              {filteredCountries.length === 0 &&
                filteredRegions.length === 0 && (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}

              {filteredRegions.length > 0 && (
                <CommandGroup heading="Regions">
                  {filteredRegions.map((r) => (
                    <CommandItem
                      key={r.slug}
                      value={r.name}
                      onSelect={() => onSelectRegion(r)}
                    >
                      {/* Optionally, add an icon or any representation for regions */}
                      {r.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredCountries.length > 0 && (
                <CommandGroup heading="Countries">
                  {filteredCountries.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={c.name}
                      onSelect={() => onSelectCountry(c)}
                    >
                      <span className="mr-2">{c.flag}</span>
                      {c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* If you need a separator or more groups, you can add them here */}
              {filteredCountries.length > 0 && filteredRegions.length > 0 && (
                <CommandSeparator />
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
