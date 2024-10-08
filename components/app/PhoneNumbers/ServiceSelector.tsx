// ServiceSelector.tsx

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

interface ServiceSelectorProps {
  selectedCountry: { cc: number; country: string } | null;
  selectedService: Service | null;
  setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
}

export default function ServiceSelector({
  selectedCountry,
  selectedService,
  setSelectedService,
}: ServiceSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchServices = async () => {
      if (selectedCountry) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://api2.sms4sats.com/getnumbersstatus?country=${selectedCountry.cc}`
          );
          if (!response.ok) {
            throw new Error(`Error fetching services: ${response.statusText}`);
          }
          const data = await response.json();
          console.log("API response:", data);
          // Since data is an array, set services directly to data
          setServices(data);
        } catch (error) {
          console.error("Error fetching services:", error);
          setServices([]); // Ensure services is always an array
        } finally {
          setLoading(false);
        }
      } else {
        setServices([]);
      }
    };

    fetchServices();
  }, [selectedCountry]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="noShadow"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
            disabled={!selectedCountry}
          >
            {selectedService ? selectedService.text : "Select a service..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {selectedCountry && (
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search for a service..." />
              <CommandList className="max-h-60 overflow-hidden">
                {loading ? (
                  <div className="p-4">Loading services...</div>
                ) : services.length > 0 ? (
                  <CommandGroup>
                    {services.map((service) => (
                      <CommandItem
                        key={`${service.key}-service`}
                        value={service.text}
                        onSelect={() => {
                          setSelectedService(service);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedService?.key === service.key
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {service.text}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No services found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
