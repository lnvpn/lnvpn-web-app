import * as React from "react";

interface PriceDisplayProps {
  selectedDuration: string;
}

export default function PriceDisplay({ selectedDuration }: PriceDisplayProps) {
  const prices: { [key: string]: number } = {
    hour: 0.1,
    day: 0.5,
    week: 1.5,
    month: 4,
    quarter: 9,
  };

  const price = prices[selectedDuration];

  return (
    <div className="text-2xl font-semibold">
      {price !== undefined ? `Price: $${price.toFixed(2)}` : "Select duration"}
    </div>
  );
}
