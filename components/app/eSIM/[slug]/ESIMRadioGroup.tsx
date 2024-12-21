"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./BundleRadioGroup";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Plan {
  id: string; // Ensure each plan has a unique ID
  name: string;
  dataInGB: number;
  durationInDays: number;
  price: number;
  countryName: string;
}

interface ESIMRadioGroupProps {
  plans: Plan[];
  onSelect: (plan: Plan) => void;
}

const ESIMRadioGroup: React.FC<ESIMRadioGroupProps> = ({ plans, onSelect }) => {
  const [selected, setSelected] = useState<string>(plans[0]?.id || "");

  const handleChange = (value: string) => {
    setSelected(value);
  };

  const handleBuyNow = () => {
    const selectedPlan = plans.find((plan) => plan.name === selected);
    if (selectedPlan) {
      onSelect(selectedPlan);
    }
  };

  return (
    <div>
      <RadioGroup
        value={selected}
        onValueChange={handleChange}
        className="space-y-4"
      >
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className="flex items-center justify-between gap-3 p-4 cursor-pointer"
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
      <div className="text-center my-6">
        <Button
          variant="neutral"
          size="lg"
          className="text-black"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ESIMRadioGroup;
