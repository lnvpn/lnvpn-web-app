import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";

import { vpnendpoints } from "@/data/vpnendpoints";

interface CountrySelectorProps {
  selectedCountry: string | undefined;
  setSelectedCountry: (country: string) => void;
}

export default function CountrySelector({
  setSelectedCountry,
  selectedCountry,
}: CountrySelectorProps) {
  return (
    <div className="flex w-full justify-between">
      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="2. Select exit point" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto sm:max-h-none sm:overflow-visible">
          <SelectGroup>
            <SelectLabel>Select exit point</SelectLabel>
            {vpnendpoints.map((endpoint) => (
              <SelectItem key={endpoint.cc} value={endpoint.cc}>
                {endpoint.country}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
