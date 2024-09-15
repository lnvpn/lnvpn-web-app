"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";

import * as React from "react";

import { cn } from "@/lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-full w-full items-center space-x-1 rounded-base border-2 border-border dark:border-darkBorder bg-white p-1",
      className
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> & {
    selected?: boolean; // Add the `selected` prop
  }
>(({ className, selected, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full h-full text-xs sm:text-sm md:text-lg items-center  select-none text-text rounded-base border-2 md:px-3 py-1.5 font-heading outline-none",
      selected ? "border-border" : "border-transparent", // Conditionally apply the border if selected
      className
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

export { Menubar, MenubarMenu, MenubarTrigger };
