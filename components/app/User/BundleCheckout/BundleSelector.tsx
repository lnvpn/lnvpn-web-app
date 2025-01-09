"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProcessedBundle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ESIMRadioGroupProps {
  plans: ProcessedBundle[];
  onSelect: (planName: string) => void;
  // Parent's currently selected plan name
  selectedPlanName: string;
}

const BundleSelector: React.FC<ESIMRadioGroupProps> = ({
  plans,
  onSelect,
  selectedPlanName,
}) => {
  const handleChange = (value: string) => {
    onSelect(value);
  };

  return (
    <RadioGroup
      value={selectedPlanName}
      onValueChange={handleChange}
      className="flex flex-col gap-3 py-4"
    >
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className="flex items-center justify-between gap-1 p-4 cursor-pointer"
          onClick={() => handleChange(plan.name)}
        >
          <RadioGroupItem
            key={plan.name}
            value={plan.name}
            id={`plan-${plan.name}`}
          />
          <Label htmlFor={`plan-${plan.name}`} className="flex flex-col">
            <span>
              {plan.dataInGB} GB • {plan.durationInDays} days •
              <strong> ${plan.price}</strong>
            </span>
          </Label>
        </Card>
      ))}
    </RadioGroup>
  );
};

export default BundleSelector;

// ---- RadioGroup Components (merged from your second file) ----

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn("grid gap-1", className)}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-5 w-5 rounded-full border-2 border-border dark:border-darkBorder text-text ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current " />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
