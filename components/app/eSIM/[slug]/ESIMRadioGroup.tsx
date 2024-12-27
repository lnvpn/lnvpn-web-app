"use client";

import { RadioGroup, RadioGroupItem } from "./BundleRadioGroup";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProcessedBundle } from "./SIMDetailPageActions";

interface ESIMRadioGroupProps {
  plans: ProcessedBundle[];
  onSelect: (planName: string) => void;
  // New prop: parent's currently selected plan name
  selectedPlanName: string;
}

const ESIMRadioGroup: React.FC<ESIMRadioGroupProps> = ({
  plans,
  onSelect,
  selectedPlanName,
}) => {
  // Instead of a local state that might get out of sync,
  // we can read the "selectedPlanName" directly from the parent
  // and only dispatch changes upward.

  const handleChange = (value: string) => {
    onSelect(value);
  };

  return (
    <RadioGroup
      value={selectedPlanName}
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
  );
};

export default ESIMRadioGroup;
