"use client";
import * as React from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/VPN/DurationToggle";
import clsx from "clsx";

interface DurationSelectorProps {
  selectedDuration: number;
  setSelectedDuration: React.Dispatch<React.SetStateAction<number>>;
}

export default function DurationSelector({
  selectedDuration,
  setSelectedDuration,
}: DurationSelectorProps) {
  const durations = [
    { value: 0.1, label: "1 hour" },
    { value: 0.5, label: "1 day" },
    { value: 1.5, label: "1 week" },
    { value: 4, label: "1 month" },
    { value: 9, label: "1 quarter" },
  ];

  return (
    <Menubar className="flex h-full w-full">
      {durations.map((duration) => (
        <MenubarMenu key={duration.value}>
          <MenubarTrigger
            className={clsx(
              "cursor-pointer text-center w-1/5 flex flex-col",
              selectedDuration === duration.value && "border-border "
            )}
            onClick={() => setSelectedDuration(duration.value)}
          >
            <span>{duration.label.split(" ")[0]}</span>
            <span>{duration.label.split(" ")[1]}</span>
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
