"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import and sort your country data
import { countrymap } from "@/data/smscountrylist";

const sortedCountries = countrymap.sort((a, b) =>
  a.country.localeCompare(b.country)
);

interface Country {
  cc: number;
  country: string;
}

interface ComboboxProps {
  selectedCountry: Country | null;
  setSelectedCountry: React.Dispatch<React.SetStateAction<Country | null>>;
}

export function SMSCountrySelector({
  selectedCountry,
  setSelectedCountry,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="noShadow"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {selectedCountry ? selectedCountry.country : "1. Select a country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full text-lg p-0">
        <Command>
          <CommandInput placeholder="Search for a country..." />
          <CommandList className="max-h-60 overflow-hidden">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {sortedCountries.map((country) => (
                <CommandItem
                  key={`${country.cc}-${country.country}`}
                  value={country.country}
                  onSelect={() => {
                    setSelectedCountry(country);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry?.cc === country.cc
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {country.country}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
