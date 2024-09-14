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

export interface IAppProps {}

export default function CountrySelector() {
  return (
    <div className="flex w-full justify-between">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="2. Select a Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select a country</SelectLabel>
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
