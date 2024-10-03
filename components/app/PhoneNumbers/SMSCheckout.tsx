"use client";
import * as React from "react";

import ServiceSelector from "./ServiceSelector";

import { SMSCountrySelector } from "./SMSCountrySelector";
import { Button } from "../../ui/button";

interface Country {
  cc: number;
  country: string;
}

interface Service {
  key: string;
  text: string;
  value: string;
  count: string;
  image: {
    avatar: boolean;
    src: string;
  };
}

export default function SMSCheckout() {
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(
    null
  );
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null
  );

  return (
    <div className="w-full mx-auto mt-10 max-w-screen-md px-4 bg-main text-black rounded-base shadow-light font-bold border-2 border-border p-4">
      <div className="flex flex-col gap-3">
        <p>
          This service gives you 20 min access to a disposable phone number to
          receive activation codes.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <SMSCountrySelector
            selectedCountry={selectedCountry}
            setSelectedCountry={(country) => {
              setSelectedCountry(country);
              setSelectedService(null);
            }}
          />
          <ServiceSelector
            selectedCountry={selectedCountry}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
          <div className="w-full justify-center flex p-2">
            <Button variant={"neutral"} size={"lg"}>
              Pay with Bitcoin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
