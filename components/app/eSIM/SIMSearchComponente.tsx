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

interface Country {
  code: string;
  name: string;
  flag: string;
  slug: string;
}

interface SearchProps {
  countries: Country[];
}

export default function Search({ countries }: SearchProps) {
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

  const filteredCountries =
    query === ""
      ? countries
      : countries.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );

  const onSelectItem = useCallback((country: Country) => {
    setOpen(false);

    router.push(`/esim/${country.slug}`);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="relative bg-white dark:text-white dark:bg-secondaryBlack shadow-nav dark:shadow-navDark hover:!translate-x-[4px] hover:!translate-y-[4px] hover:shadow-none dark:hover:shadow-none px-5 pr-20 h-[44px] text-lg shrink-0"
      >
        <span className="m1250:hidden">Search countries...</span>
        <span className="hidden m1250:inline">
          <SearchIcon className="h-4 w-4 m900:w-6 m900:h-6 shrink-0" />
        </span>
        <span className="absolute m1100:hidden text-black border text-base px-1 py-0.5 border-black rounded-base bg-main h-[28px] right-2 top-1.5">
          ⌘K
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden rounded-none border-0 p-0">
          <DialogHeader className="hidden">
            <DialogTitle>Search for country</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <Command className="rounded-none">
            <CommandInput
              placeholder="Type a country name..."
              value={query}
              onValueChange={(val) => setQuery(val)}
            />
            <CommandList className="command-scrollbar">
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="Countries">
                {filteredCountries.map((c) => (
                  <CommandItem
                    key={c.code}
                    value={c.name}
                    onSelect={() => onSelectItem(c)}
                  >
                    <span className="mr-2">{c.flag}</span>
                    {c.name}
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* If you need a separator or more groups, you can add them here */}
              {filteredCountries.length > 0 && <CommandSeparator />}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
